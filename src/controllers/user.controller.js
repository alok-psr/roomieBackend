import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiErr} from "../utils/ApiErr.js"
import {ApiRes} from "../utils/ApiRes.js"
import jwt from "jsonwebtoken";
import { cloudinaryUpload } from "../utils/cloudinary.js";

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
      .json(new ApiRes(201, { user: createdUser, token }, "User registered successfully "));
  } catch (error) {
    console.error("Registration failed ", error);
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


const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    let { name, age, phoneNumber, dealbrakers, budget, interests, leaseDuration, moveinDate, description, accessToken } = req.body;

    console.log({
      description,
      accessToken
    })

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json(new ApiRes(401, null, "Invalid or expired access token"));
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json(new ApiRes(404, null, "User not found"));
    }

    // Parse incoming arrays if they are strings
    if (typeof dealbrakers === "string") {
      try {
        dealbrakers = JSON.parse(dealbrakers);
      } catch {
        dealbrakers = dealbrakers.split(",").map(s => s.trim());
      }
    }
    if (typeof interests === "string") {
      try {
        interests = JSON.parse(interests);
      } catch {
        interests = interests.split(",").map(s => s.trim());
      }
    }

    // updating the avatar
    
    if(!req.file?.buffer){
        new ApiRes(400, "avatar file is required")
    }
    console.log("file buffer ::",req.file.buffer)
    const avatar = await cloudinaryUpload(req.file.buffer)
    if (!avatar.secure_url){
      new ApiRes(500, "avatar url not found")
    }
    if(avatar.secure_url) user.avatar = avatar.secure_url

    // Update fields if provided
    if (name) user.name = name;
    if (age) user.age = Number(age);
    if (phoneNumber) user.phoneNumber = Number(phoneNumber);
    if (dealbrakers) user.dealbrakers = dealbrakers;
    if (description) user.description = description;
    if (budget) user.budget = Number(budget);
    if (interests) user.interests = interests;
    if (leaseDuration) user.leaseDuration = Number(leaseDuration);
    if (moveinDate) user.moveinDate = new Date(moveinDate);
    user.isLooking = true

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    return res.status(200).json(new ApiRes(200, updatedUser, "User profile updated successfully"));
  } catch (error) {
    console.error("Profile update failed", error);
    return res.status(500).json(new ApiRes(500, null, "Profile update failed"));
  }
});


const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(new ApiRes(200, users, "All users fetched successfully"));
  } catch (error) {
    console.error("Fetching all users failed", error);
    return res.status(500).json(new ApiRes(500, null, "Failed to fetch users"));
  }
});
const getUser = asyncHandler(async (req,res)=>{
  try {
    const {accessToken} = req.body
    const user =await User.findOne({accessToken})
    // const user = res.json();
    console.log("got the user ", user)
    return res.status(200).json(new ApiRes(200, user, "user fetched "))
  } catch (error) {
    console.log("unable to get the user", error)
    return res.json(new ApiRes(500, {}, "unable to get user"))
  }
})

export {
    registerUser,
    loginUser,
    updateUserProfile,
    getAllUsers,
    getUser
}