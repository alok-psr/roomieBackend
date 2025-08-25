import { Listing } from "../models/listing.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiErr} from "../utils/ApiErr.js"
import { ApiRes } from "../utils/ApiRes.js"
import { cloudinaryRemove, cloudinaryUpload } from "../utils/cloudinary.js"

const registerListing = asyncHandler(async (req,res)=>{
    let {listingName, description, rent, address, tags, postedBy, isAvailable} = req.body;
    
    if([listingName,description,rent,address,postedBy].some((ele)=>ele?.trim()==='' )){
        console.log('all fields required')
        throw new ApiErr(401,"all fields are required " )
    }

    let parsedAddress = address;
    let parsedTags = tags;
    if (typeof address === 'string') parsedAddress = JSON.parse(address);
    if (typeof tags === 'string') parsedTags = JSON.parse(tags);

    rent = Number(rent)
    isAvailable = isAvailable ==="true"

    let coverImageLocalPath;
    try {
        coverImageLocalPath = req.file?.path
        console.log(coverImageLocalPath)
    } catch (e) {
        throw new ApiErr(400, 'cover image not found locally')
    }

    const coverImage = await cloudinaryUpload(coverImageLocalPath)

    let listing ;
    try {
        console.log('registering the listing')
        console.log({
        listingName,
        description,
        rent,
        address:parsedAddress,
        tags: parsedTags,
        postedBy,
        isAvailable,
        coverImage: coverImage?.url
        });
        listing = await Listing.create({
            listingName,
            description,
            rent,
            address:parsedAddress,
            tags:parsedTags,
            postedBy,
            isAvailable,
            coverImage:coverImage.url
        })
        console.log("done")
        console.log(listing._id)
        // const newListing = await Listing.findById(listing._id)
        // if (!newListing) {
        //     throw new ApiErr(401, "registered listing not found")
        // }
        res.status(200).json(new ApiRes(200,listing,"listing was created successfully"))
    } catch (error) {
        if(coverImage){
            cloudinaryRemove(coverImageLocalPath)
        }
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
