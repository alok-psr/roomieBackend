import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiErr} from "../utils/ApiErr.js"
import {ApiRes} from "../utils/ApiRes.js"

const registerUser = asyncHandler(async (req, res) => {
  try {
    let { name, email, age, phoneNumber, password } = req.body;

    age = Number(age);
    phoneNumber = Number(phoneNumber);

    console.log("Register attempt:", [name, email, age, phoneNumber, password]);

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json(new ApiRes(400, null, "User already exists in the DB"));
    }

    const user = await User.create({
      name,
      age,
      phoneNumber,
      email,
      password,
    });

    const token = user.generateAccessToken();

    // make sure password never leaks
    const createdUser = await User.findById(user._id).select("-password");

    return res
      .status(201)
      .json(new ApiRes(201, { user: createdUser, token }, "User registered successfully ✅"));
  } catch (error) {
    console.error("Registration failed ❌", error);
    return res.status(500).json(new ApiRes(500, null, "User registration failed"));
  }
});


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
    console.error("Login failed ", error);
    return res.status(500).json(new ApiRes(500, null, "Login failed"));
  }
});


export {
    registerUser,
    loginUser
}