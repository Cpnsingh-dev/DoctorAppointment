import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import appointmentModel from "../models/appontmentModel.js";

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to change doctor availability
const changeAvailability = async (req, res) => {
    try {
        const docId = req.body?.docId || req.body?.doctorId || req.doctorId;
        if (!docId) {
            return res.json({ success: false, message: "Doctor ID is required" });
        }
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
        res.json({ success: true, message: "Availability changed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api to login doctors
const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.json({ success: true, message: "Login successful", token, doctor });
        }
        else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api to register doctors
const doctorRegister = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, hospital } = req.body;
        const doctor = await doctorModel.findOne({ email });
        if (doctor) {
            return res.json({ success: false, message: "Doctor already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = new doctorModel({
            name,
            email,
            password: hashedPassword,
            specialization,
            experience,
            hospital
        });
        await newDoctor.save();
        res.json({ success: true, message: "Doctor registered successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api to get all the appointments for doctor panel
const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const appointments = await appointmentModel.find({ doctorId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const appointmentId = req.body?.appointmentId || req.body?.aptId;

        if (!appointmentId) {
            return res.json({ success: false, message: "Appointment ID is required" });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.doctorId.toString() !== doctorId.toString()) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        if (appointmentData.cancel) {
            return res.json({ success: false, message: "Appointment is already cancelled" });
        }

        if (appointmentData.isComplete) {
            return res.json({ success: false, message: "Cannot cancel a completed appointment" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancel: true, status: "Cancelled" });

        // releasing doctor slot
        const { slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(doctorId);

        if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
            let slots_booked = { ...doctorData.slots_booked };
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(doctorId, { slots_booked });
        }

        res.json({ success: true, message: "Appointment cancelled successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const appointmentId = req.body?.appointmentId || req.body?.aptId;

        if (!appointmentId) {
            return res.json({ success: false, message: "Appointment ID is required" });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.doctorId.toString() !== doctorId.toString()) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        if (appointmentData.cancel) {
            return res.json({ success: false, message: "Cannot complete a cancelled appointment" });
        }

        if (appointmentData.isComplete) {
            return res.json({ success: false, message: "Appointment is already completed" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { isComplete: true, status: "Completed" });

        res.json({ success: true, message: "Appointment completed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api to get doctorDashboard data
const getDoctorDashboard = async (req, res) => {
    try {
        const doctorId = req.doctorId || req.body?.docId || req.body?.doctorId;
        const appointments = await appointmentModel.find({ doctorId });

        let earnings = 0;
        let totalCompletedAppointments = 0;
        let totalCancelledAppointments = 0;
        let patients = [];

        appointments.forEach((item) => {
            if (item.isComplete || item.payment) {
                earnings += (item.amount || item.fees || item.fee || 0);
            }
            if (item.isComplete) {
                totalCompletedAppointments++;
            }
            if (item.cancel) {
                totalCancelledAppointments++;
            }
            if (item.userId && !patients.includes(item.userId.toString())) {
                patients.push(item.userId.toString());
            }
        });

        const latestAppointments = [...appointments].reverse().slice(0, 5);

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            totalCompletedAppointments,
            totalCancelledAppointments,
            latestAppointments
        };

        res.json({ success: true, dashData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get doctor profile
const getDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const profileData = await doctorModel.findById(doctorId).select('-password');
        if (!profileData) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update doctor profile data
const updateDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { fees, address, available, about } = req.body;

        let parsedAddress = address;
        if (typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address);
            } catch (err) {
                parsedAddress = { line1: address, line2: "" };
            }
        }

        const updateData = {};
        if (fees !== undefined && fees !== null && fees !== '') updateData.fees = Number(fees);
        if (available !== undefined) updateData.available = Boolean(available);
        if (about !== undefined) updateData.about = about;
        if (parsedAddress !== undefined) updateData.address = parsedAddress;

        await doctorModel.findByIdAndUpdate(doctorId, updateData);
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    doctorList,
    changeAvailability,
    doctorLogin,
    doctorRegister,
    getDoctorAppointments,
    appointmentCancel,
    appointmentComplete,
    getDoctorDashboard,
    getDoctorProfile,
    updateDoctorProfile
};
