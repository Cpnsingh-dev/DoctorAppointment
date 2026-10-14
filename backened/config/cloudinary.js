import { v2 as cloudinary } from "cloudinary";


const connectCloudinary = async () => {
    try {
        const cloud_name = process.env.CLOUDINARY_NAME?.trim().replace(/['"]/g, "");
        const api_key = process.env.CLOUDINARY_API_KEY?.trim().replace(/['"]/g, "");
        const api_secret = process.env.CLOUDINARY_SECRET_KEY?.trim().replace(/['"]/g, "");

        cloudinary.config({
            cloud_name,
            api_key,
            api_secret,
        });
        console.log("Cloudinary Configured Successfully with cloud:", cloud_name);
    } catch (error) {
        console.log("Cloudinary Connection Failed", error);
    }
}

export default connectCloudinary