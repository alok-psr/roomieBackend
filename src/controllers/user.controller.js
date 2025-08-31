import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiErr} from "../utils/ApiErr.js"
import {ApiRes} from "../utils/ApiRes.js"

const registerUser = asyncHandler(async (req,res)=>{
    let {name,email,age,phoneNumber,password} = req.body;

    
    age = Number(age)
    phoneNumber = Number(phoneNumber)
    
    console.log([name,email,age,phoneNumber,password])
    const existedUser = await User.findOne({$or:[{email}]})
    if (existedUser) {
        throw new ApiErr(500 , "user already exits in the db")
    }

    let user;
    try {
        user = await User.create({
            name,
            age,
            phoneNumber,
            email,
            password
        })
    } catch (error) {
        throw new ApiErr(400,"user not created", error)
    }
    const token = user.generateAccessToken()
    user.save;
    const createdUser =await User.findById(user._id).select('-passsword')

    return res.status(200).json(new ApiRes(200, createdUser, "user registered successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new ApiErr(404, "User not found");
        }
        if (typeof password !== "string") {
            throw new ApiErr(400, "Password must be a string");
        }
        const pswdCmp = await user.isPasswordCorrect(password);
        if (pswdCmp) {
            let token = await user.generateAccessToken();
            return res.status(200).json(new ApiRes(200, user, "user fetched"));
        } else {
            throw new ApiErr(400, "wrong password");
        }
    } catch (error) {
        console.log("login failed", error);
        throw new ApiErr(500, "login failed", error);
    }
});

export {
    registerUser,
    loginUser
}