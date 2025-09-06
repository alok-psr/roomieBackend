import { Listing } from "../models/listing.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiErr} from "../utils/ApiErr.js"
import { ApiRes } from "../utils/ApiRes.js"
import { cloudinaryRemove, cloudinaryUpload } from "../utils/cloudinary.js"

const registerListing = asyncHandler(async (req,res)=>{
    let {listingName, description, rent, phoneNumber, address, tags, houseRules, isAvailable, ownerName} = req.body;
    
    if([listingName,description,rent,address,ownerName].some((ele)=>ele?.trim()==='' )){
        console.log('all fields required')
        throw new ApiErr(401,"all fields are required " )
    }

    let parsedTags = houseRules;
    if (typeof tags === 'string') tags = JSON.parse(tags);
    if (typeof houseRules === 'string') parsedTags = JSON.parse(houseRules);

    rent = Number(rent)
    isAvailable = isAvailable ==="true"

    


    let listing ;
    try {
        console.log('registering the listing')
        console.log({
        listingName,
        description,
        rent,
        address:parsedAddress,
        houseRules: parsedTags,
        ownerName,
        isAvailable,
        // coverImage: coverImage?.url
        });
        let coverImage;
        if (req.file?.buffer) {
            console.log("file buffer ::", req.file.buffer);
            coverImage = await cloudinaryUpload(req.file.buffer);
            console.log(coverImage.url)
        }
        listing = await Listing.create({
            listingName,
            description,
            rent,
            address,
            tags,
            houseRules:parsedTags,
            ownerName,
            isAvailable,
            phoneNumber,
            coverImage:coverImage.secure_url
        })
        
        console.log("done")
        console.log(listing._id)
        // const newListing = await Listing.findById(listing._id)
        // if (!newListing) {
        //     throw new ApiErr(401, "registered listing not found")
        // }
        res.status(200).json(new ApiRes(200,listing,"listing was created successfully"))
    } catch (error) {
        throw new ApiErr(501, 'unable to create a new listing',error)
    }
})

const getAllListing = asyncHandler(async (req,res)=>{
    let query;
    try {
        query=await Listing.find({})
        console.log(query, '\n', typeof(query))
        res.status(200).json(new ApiRes(200,query,"fetched all listings successfully ... less goo bitch"))
    } catch (error) {
        throw new ApiErr(501 ,"unable to fetch listings", error)
    }
})

export { registerListing,getAllListing }