

import jwt from "jsonwebtoken"
import doctorModel from "../models/doctorModel.js"

//doctor identification middleware
const authDoctor = async (req, res, next) => {
    try {
        // Express converts all incoming headers to lowercase
        const authToken = req.headers.authtoken || req.headers.dtoken || req.headers.token || req.headers['auth-token'];
        if (!authToken) {
            return res.json({ success: false, message: "Unauthorized - Token not found in headers" })
        }
        const jwtSecret = process.env.JWT_SECRET?.trim();
        const decodedToken = jwt.verify(authToken, jwtSecret)
        const doctorId = decodedToken.id;

        if (!doctorId) {
            return res.json({ success: false, message: "Unauthorized - Invalid token" })
        }
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "doctor not found" })
        }
        req.doctorId = doctorId;
        if (!req.body) {
            req.body = {};
        }
        req.body.doctorId = doctorId;
        req.body.docId = doctorId;
        next()
    } catch (error) {
        console.log("Auth error:", error);
        res.json({ success: false, message: error.message })
    }
}

export default authDoctor;