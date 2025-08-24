import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({

    uid:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    location:{
        type:String,
        lowercase:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true,
    },
    fullname:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        trim:true,
        unique:true
    }

},{timestamps:true})




export const User = mongoose.model("User",userSchema)