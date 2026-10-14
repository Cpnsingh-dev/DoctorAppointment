import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

//user identification middleware
const authUser = async (req, res, next) => {
    try {
        // Express converts all incoming headers to lowercase
        const authToken = req.headers.authtoken || req.headers.atoken || req.headers.token || req.headers['auth-token'];
        if (!authToken) {
            return res.json({ success: false, message: "Unauthorized - Token not found in headers" })
        }
        const jwtSecret = process.env.JWT_SECRET?.trim();
        const decodedToken = jwt.verify(authToken, jwtSecret)
        const userId = decodedToken.id;

        if (!userId) {
            return res.json({ success: false, message: "Unauthorized - Invalid token" })
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }
        req.userId = userId;
        if (req.body) {
            req.body.userId = userId;
        }
        next()
    } catch (error) {
        console.log("Auth error:", error);
        res.json({ success: false, message: error.message })
    }
}

export default authUser;