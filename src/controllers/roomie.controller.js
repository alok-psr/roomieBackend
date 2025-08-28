import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiErr } from "../utils/ApiErr.js"
import {ApiRes} from "../utils/ApiRes.js"
import { cloudinaryUpload } from "../utils/cloudinary.js";
import fs from "fs"
import { Roomie } from "../models/roomie.model.js";


const registerRoomie = asyncHandler(async (req,res)=>{
    let {name,age,profession,description,location,qualities,dealBrakers} = req.body;


    let parsedLocation = location;
    let parsedQualities = qualities;
    let parsedDealBrakers = dealBrakers;
    if (typeof location === 'string') parsedLocation = JSON.parse(location);
    if (typeof qualities === 'string') parsedQualities = JSON.parse(qualities);
    if (typeof dealBrakers === 'string') parsedDealBrakers = JSON.parse(dealBrakers);

    
    age = Number(age)


    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiErr(401, "avatar not found")
    }
    
    let result;
    try {
        result =await cloudinaryUpload(avatarLocalPath)
        

    } catch (error) {
        throw new ApiErr(500,"unable to upload to cloudinary", error)
    }
    let roomie;
    try {
        console.log({
            avatar:result?.url,
            name,
            age,
            profession,
            description,
            location:parsedLocation,
            qualities:parsedQualities,
            dealBrakers:parsedDealBrakers
        })
        console.log(dealBrakers)
        roomie = await Roomie.create({
            avatar:result?.url,
            name,
            age,
            profession,
            description,
            location:parsedLocation,
            qualities:parsedQualities,
            dealBrakers:parsedDealBrakers
        })

        res.status(200).json(new ApiRes(200, roomie, "roomie added to DB"))
    } catch (error) {
        throw new ApiErr(500, "unable to create roomie", error)
    }
})

const getAllRoomies = asyncHandler(async (req,res)=>{
        
    try {
        const result = await Roomie.find({});
        console.log("roomies fetched", result)
        res.status(200).json(new ApiRes(200,result,"roomies fetched successfully"))
    } catch (error) {
        throw new ApiErr(500, "unable to fetch roomies bruh ", error)
    }

})

export {registerRoomie, getAllRoomies}