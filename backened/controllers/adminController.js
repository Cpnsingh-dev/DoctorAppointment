import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appontmentModel.js"
import userModel from "../models/userModel.js"


// Api for adding doctor
const addDoctor = async (req, res) => {

    try {
        const { name, email, password, speciality, experience, about, fees, address } = req.body
        const degree = req.body.degree || req.body.education
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
            return res.json({ success: false, message: "All Fields are required" })
        }
        // validating email formate
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please provide a valid email address" })
        }
        // validating password format
        if (password.length < 8) {
            return res.json({ success: false, message: "Please provide a password of at least 8 characters" })
        }
        // checking email already exists
        const doctor = await doctorModel.findOne({ email })
        if (doctor) {
            return res.json({ success: false, message: "Doctor already exists" })
        }

        // hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME?.trim(),
            api_key: process.env.CLOUDINARY_API_KEY?.trim(),
            api_secret: process.env.CLOUDINARY_SECRET_KEY?.trim(),
        });

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            folder: "doctor_profiles",
            resource_type: "image"
        });

        const imageUrl = imageUpload.secure_url;

        // Safely parse address whether it's JSON, a JS object string, or already parsed
        let parsedAddress;
        if (typeof address === 'object') {
            parsedAddress = address;
        } else {
            try {
                parsedAddress = JSON.parse(address);
            } catch (e1) {
                try {
                    // Converts JS object syntax (single quotes & unquoted keys from assets.js) to valid JSON
                    const formatted = address
                        .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                        .replace(/'/g, '"');
                    parsedAddress = JSON.parse(formatted);
                } catch (e2) {
                    parsedAddress = { line1: address, line2: "" };
                }
            }
        }

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            experience,
            degree,
            about,
            fees,
            address: parsedAddress,
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor Added successfully" })
    } catch (error) {
        console.log("Upload error details:", error);
        res.json({ success: false, message: error.message });
    }
}

// APi for the admin  login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        const adminEmail = process.env.ADMIN_EMAIL?.trim();
        const adminPassword = process.env.ADMIN_PASSWORD?.trim();
        const jwtSecret = process.env.JWT_SECRET?.trim();

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign(email + password, jwtSecret)
            res.json({ success: true, message: "Login success", token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//Api to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password")
        res.json({ success: true, doctors, data: doctors, message: "Doctors list fetched successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api to get all appointment list
const appointmentAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({}).sort({ date: -1 })

        if (appointments.length === 0) {
            return res.json({ success: false, message: "Appointments not found" })
        }
        res.json({ success: true, appointments, message: "Appointments fetched successfully" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }
}

//api to cancel the appointment for admin 
const cancelAdminAppointment = async (req, res) => {
    try {
        const aptId = req.body?.aptId || req.body?.appointmentId || req.params?.aptId;

        if (!aptId) {
            return res.json({ success: false, message: "Appointment ID is required" });
        }

        const appointmentData = await appointmentModel.findById(aptId);
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        const appointment = await appointmentModel.findByIdAndUpdate(
            aptId,
            { cancel: true, status: "Cancelled" },
            { new: true }
        );

        // releasing doctor slot
        const { doctorId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(doctorId);

        if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
            let slots_booked = { ...doctorData.slots_booked };
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(doctorId, { slots_booked });
        }

        res.json({ success: true, appointment, message: "Appointment cancelled successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api for dashboard on the adminDashboard
const adminDashboard = async (req, res) => {
    try {
        const totalDoctors = await doctorModel.countDocuments()
        const totalAppointments = await appointmentModel.countDocuments()
        const totalPatients = await userModel.countDocuments()
        const totalCompletedAppointments = await appointmentModel.countDocuments({ isComplete: true })
        const totalCancelledAppointments = await appointmentModel.countDocuments({ cancel: true })

        const dashData = {
            doctors: totalDoctors,
            appointments: totalAppointments,
            patients: totalPatients,
            totalCompletedAppointments: totalCompletedAppointments,
            totalCancelledAppointments: totalCancelledAppointments,
            latestAppointments: await appointmentModel.find().sort({ date: -1 }).limit(5)
        }

        res.json({ success: true, dashData, message: "Dashboard data fetched successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addDoctor, loginAdmin, allDoctors, appointmentAdmin, cancelAdminAppointment, adminDashboard }