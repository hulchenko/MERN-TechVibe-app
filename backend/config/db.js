import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Successfully connected to the DB: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Couldn't connect to the DB: ${error.message}`)
        process.exit(1);
    }
}

export default connectDB;