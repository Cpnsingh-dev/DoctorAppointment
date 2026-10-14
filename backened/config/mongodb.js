import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database Connection Failed", error);
    }
}

export default connectDB