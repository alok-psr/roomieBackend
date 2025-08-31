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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(new ApiRes(404, null, "User not found"));
    }

    if (typeof password !== "string") {
      return res.status(400).json(new ApiRes(400, null, "Password must be a string"));
    }

    const pswdCmp = await user.isPasswordCorrect(password);
    if (!pswdCmp) {
      return res.status(400).json(new ApiRes(400, null, "Wrong password"));
    }

    const token = await user.generateAccessToken();
    return res.status(200).json(new ApiRes(200, { user, token }, "User fetched"));
  } catch (error) {
    console.error("Login failed ❌", error);
    return res.status(500).json(new ApiRes(500, null, "Login failed"));
  }
});


export {
    registerUser,
    loginUser
}