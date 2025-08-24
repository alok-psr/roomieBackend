import mongoose from "mongoose"

const connectDB = async ()=>{
    try {
        const conIns = mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log("DB connected successfully bitch less gooo :: " ,conIns.host)
    } catch (e) {
        console.log("unable to connect to database bitch .." , e)
        process.exit(1)
    }
}

export default connectDB
