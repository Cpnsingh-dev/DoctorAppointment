import validator from "validator"
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appontmentModel.js"
import Razorpay from "razorpay"

//Api to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" })
        }

        // checking user already exists
        const user = await userModel.findOne({ email })
        if (user) {
            return res.json({ success: false, message: "User already exists" })
        }

        // hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,

        }

        const newUser = new userModel(userData)
        const savedUser = await newUser.save()

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET?.trim());

        res.json({ success: true, message: "User registered successfully", token });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//Api for userlogin
const LoginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.json({ success: false, message: "Invalid credentials" });
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET?.trim());
            res.json({ success: true, message: "User logged in successfully", token });
        }


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//get user profile data
const getProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const userData = await userModel.findById(userId).select('-password');
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "User profile data fetched successfully", userData, data: userData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//api to update the proifle data
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const { name, phone, dob, address, gender } = req.body;
        const imgFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        let parsedAddress = address;
        if (typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address);
            } catch (err) {
                parsedAddress = { line1: address, line2: "" };
            }
        }

        const updateData = {
            name,
            phone,
            dob,
            gender,
            ...(parsedAddress !== undefined && { address: parsedAddress }),
        };

        if (imgFile) {
            const imgUpload = await cloudinary.uploader.upload(imgFile.path, {
                resource_type: "image",
                folder: "profile",
            });
            updateData.image = imgUpload.secure_url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            message: "User profile data updated successfully",
            userData: updatedUser,
        });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

//api to book appointment of doctor
const bookAppointment = async (req, res) => {
    try {
        const { userId, doctorId, docId, slotDate, slotTime } = req.body;
        const selectedDoctorId = doctorId || docId;

        if (!selectedDoctorId || !slotDate || !slotTime) {
            return res.json({ success: false, message: "Data Missing" });
        }

        const userData = await userModel.findById(userId).select("-password");
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const doctorData = await doctorModel.findById(selectedDoctorId).select("-password");
        if (!doctorData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        if (!doctorData.available) {
            return res.json({ success: false, message: "Doctor is not available" });
        }

        let slots_booked = doctorData.slots_booked ? { ...doctorData.slots_booked } : {};
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot already booked" });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        const docData = doctorData.toObject ? doctorData.toObject() : { ...doctorData };
        delete docData.slots_booked;

        const appointmentData = {
            doctorId: selectedDoctorId,
            userId,
            slotDate,
            slotTime,
            amount: doctorData.fees,
            userData,
            docData,
            doctorData: docData,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(selectedDoctorId, { slots_booked });

        return res.json({
            success: true,
            message: "Appointment booked successfully",
            newAppointment,
        });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

// API to get user appointments for frontend my-appointments / my-bookings page
const listAppointment = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const appointments = await appointmentModel.find({ userId }).sort({ date: -1, createdAt: -1 });
        return res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // verify appointment user
        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancel: true });

        // releasing doctor slot
        const { doctorId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(doctorId);

        if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
            let slots_booked = { ...doctorData.slots_booked };
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(doctorId, { slots_booked });
        }

        return res.json({ success: true, message: "Appointment Cancelled" });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

//Api for online Payment through razorpay
const appointmentRazorpay = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancel === true || appointmentData.payment === true) {
            return res.json({ success: false, message: "Appointment not found or already cancelled or already paid" });
        }

        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        const razorpayKeyId = process.env.RAZORPAY_KEY_ID?.replace(/['"]/g, '').trim();
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.replace(/['"]/g, '').trim();

        if (!razorpayKeyId || !razorpayKeySecret) {
            return res.json({ success: false, message: "Razorpay credentials are not configured in backend .env" });
        }

        const userData = await userModel.findById(userId).select("-password");
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const doctorData = await doctorModel.findById(appointmentData.doctorId).select("-password");
        if (!doctorData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        const amount = appointmentData.amount || doctorData.fees;

        const razorpayInstance = new Razorpay({
            key_id: razorpayKeyId,
            key_secret: razorpayKeySecret,
        });

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: process.env.CURRENCY?.trim() || "INR",
            receipt: appointmentId.toString(),
            payment_capture: 1
        };

        const order = await razorpayInstance.orders.create(options);
        if (order) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { orderId: order.id });
            return res.json({
                success: true,
                message: "Order created successfully",
                order,
                amount,
                key: razorpayKeyId
            });
        } else {
            return res.json({ success: false, message: "Failed to create order" });
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

//Verify payment from razorpay
const verifyPayment = async (req, res) => {
    try {
        const userId = req.userId || req.body?.userId;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

        if (!razorpay_order_id) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        const razorpayKeyId = process.env.RAZORPAY_KEY_ID?.replace(/['"]/g, '').trim();
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.replace(/['"]/g, '').trim();

        if (!razorpayKeyId || !razorpayKeySecret) {
            return res.json({ success: false, message: "Razorpay credentials are not configured in backend .env" });
        }

        const razorpayInstance = new Razorpay({
            key_id: razorpayKeyId,
            key_secret: razorpayKeySecret,
        });

        let isVerified = false;
        if (razorpay_signature && razorpay_payment_id) {
            const crypto = await import("crypto");
            const expectedSignature = crypto.default
                .createHmac("sha256", razorpayKeySecret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest("hex");


            if (expectedSignature === razorpay_signature) {
                isVerified = true;
            }
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        const targetAppointmentId = appointmentId || orderInfo.receipt;

        if (isVerified || orderInfo.status === "paid") {
            await appointmentModel.findByIdAndUpdate(targetAppointmentId, { payment: true });
            return res.json({ success: true, message: "Payment Successful" });
        } else {
            return res.json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

export {
    registerUser,
    LoginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    appointmentRazorpay,
    verifyPayment,
    appointmentRazorpay as paymentRazorpay,
    verifyPayment as verifyRazorpay
};