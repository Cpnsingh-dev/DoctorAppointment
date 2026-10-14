import express from "express"
import {
    registerUser,
    LoginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    appointmentRazorpay,
    verifyPayment
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", LoginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay", authUser, appointmentRazorpay);
userRouter.post("/appointment-razorpay", authUser, appointmentRazorpay);
userRouter.post("/verify-razorpay", authUser, verifyPayment);
userRouter.post("/verify-payment", authUser, verifyPayment);


export default userRouter;


