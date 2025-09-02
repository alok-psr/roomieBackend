import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import { ApiErr } from './ApiErr.js'

import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const cloudinaryUpload = async(filePath)=>{

    console.log("from cloud.js")
    console.log(filePath)
    try {
        const result = await cloudinary.uploader.upload(filePath,{resource_type:"auto"})
    
        console.log("uploaded on cloudinary")
        console.log("del from local folder ....")
    
        fs.unlinkSync(filePath)
        return result
    } catch (error) {
        throw new ApiErr(500, "unable to upload to cloudinary" , error)
    }
    
}

const cloudinaryRemove = async(publicId)=>{
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        console.log("image removed ... woohoo , ", result)
    } catch (error) {
        throw new ApiErr(401 , "unable to remove image ")
    }
}

export {cloudinaryUpload, cloudinaryRemove}