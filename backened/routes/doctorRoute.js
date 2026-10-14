

import express from 'express';
import {
    doctorList,
    doctorLogin,
    doctorRegister,
    changeAvailability,
    getDoctorAppointments,
    appointmentCancel,
    appointmentComplete,
    getDoctorDashboard,
    getDoctorProfile,
    updateDoctorProfile
} from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.post('/register', doctorRegister);
doctorRouter.post('/login', doctorLogin);
doctorRouter.get('/list', doctorList);
doctorRouter.post('/change-availability', changeAvailability);
doctorRouter.get('/appointments', authDoctor, getDoctorAppointments);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.get('/dashboard', authDoctor, getDoctorDashboard);
doctorRouter.get('/profile', authDoctor, getDoctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);

export default doctorRouter;
