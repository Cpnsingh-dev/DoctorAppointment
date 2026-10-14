import mongoose from "mongoose";

const appointmentShecma = new mongoose.Schema({
    doctorId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    slotDate: {
        type: String,
        required: true
    },
    slotTime: {
        type: String,
        required: true
    },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancel: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isComplete: { type: Boolean, default: false },
}, { timestamps: true })

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentShecma);

export default appointmentModel;