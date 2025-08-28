import mongoose,{ Schema} from "mongoose";

const userSchema = new Schema({

    _id:{
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
    },
    likedRoomies:[{type:mongoose.Schema.Types.ObjectId,
        ref:"roomie"
    }],
    bookMarkedRoomies:[{type:mongoose.Schema.Types.ObjectId,
        ref:"roomie"
    }]

},{timestamps:true})




export const User = mongoose.model("User",userSchema)