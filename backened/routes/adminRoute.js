import express from 'express'
import { addDoctor, allDoctors, loginAdmin, appointmentAdmin, cancelAdminAppointment, adminDashboard } from '../controllers/adminController.js'
import upload from '../middleware/multer.js'
import authAdmin from '../middleware/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/all-doctors', authAdmin, allDoctors);
adminRouter.post('/all-doctor', authAdmin, allDoctors);
adminRouter.get('/all-doctors', authAdmin, allDoctors);
adminRouter.post('/change-availability', authAdmin, changeAvailability);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-appointments', authAdmin, appointmentAdmin);
adminRouter.post('/cancel-appointment', authAdmin, cancelAdminAppointment);
adminRouter.post('/dashboard', authAdmin, adminDashboard);

export default adminRouter;