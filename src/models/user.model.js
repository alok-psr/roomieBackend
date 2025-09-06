import mongoose,{ Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new Schema({

    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    phoneNumber:{type:Number, required:true},
    age:{type:Number, required:true},
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{type:String, required:true},
    likedRoomies:[{type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    bookMarkedRoomies:[{type:mongoose.Schema.Types.ObjectId,
        ref:"roomie"
    }],
    accessToken:String,
    occupation:{type:String,
        default:"Student"
    },
    workPlace:{type:String,
        default:"University"
    },

    // New attributes
    dealbrakers: [{ type: String }],
    budget: { type: Number },
    interests: [{ type: String }],
    leaseDuration: { type: Number }, // in months
    moveinDate: { type: Date },
    description:String,
    isLooking:{
        type:Boolean,
        default:false
    },
    avatar:String,


},{timestamps:true})

userSchema.pre('save',async function (next) {
    // 'this' is the context for userSchema all attributes of userSchema like username , pswd, first name ext are available through this.*attribute*
    if (!this.isModified("password")) next()
    console.log("pswd before",this.password)
    this.password = await bcrypt.hash(this.password,10) // hash the pswd by 10 rounds 
    console.log("pswd before",this.password)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password) {
    console.log(this.password.trim(), ":and pswd from the login ::" ,password.trim())
    return await bcrypt.compare(password.trim(),this.password)
}

userSchema.methods.generateAccessToken = async function(){
    const token = jwt.sign({
        _id:this._id,
    },process.env.ACCESS_TOKEN_SECRET)
    this.accessToken = token
    await this.save();
    return token
}

export const User = mongoose.model("User",userSchema)