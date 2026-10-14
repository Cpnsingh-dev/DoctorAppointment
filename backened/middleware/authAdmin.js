import jwt from "jsonwebtoken"

//admin identification middleware
const authAdmin = async (req, res, next) => {
    try {
        // Express converts all incoming headers to lowercase
        const authToken = req.headers.authtoken || req.headers.atoken || req.headers.token || req.headers['auth-token'];
        if (!authToken) {
            return res.json({ success: false, message: "Unauthorized - Token not found in headers" })
        }
        const jwtSecret = process.env.JWT_SECRET?.trim();
        const decodedToken = jwt.verify(authToken, jwtSecret)
        const adminEmail = process.env.ADMIN_EMAIL?.trim();
        const adminPassword = process.env.ADMIN_PASSWORD?.trim();

        if (decodedToken !== adminEmail + adminPassword) {
            return res.json({ success: false, message: "Unauthorized - Invalid token" })
        }
        next()
    } catch (error) {
        console.log("Auth error:", error);
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin;