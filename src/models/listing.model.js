import mongoose,{ Schema } from "mongoose";


// fields req::
/* 
    listingName: Str,
    description:Str,
    rent:num,
    address:{area,city},
    tags :[],
    postedby:mongoose User,
    isAvailable:bool,
    coverImage:Str,
    // referenceImages:[]
    
*/


const listingSchema = new Schema({
    listingName:String,
    description:String,
    rent:Number,
    address:{
        area: String,
        city: {
            type:String,
            default:"delhi"
        },
    },
    tags: [String],
    availableFrom:Date,
    postedBy: {
        // type:mongoose.Schema.Types.ObjectId, 
        // ref:"User"
        type:String
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    coverImage:{
        type:String,
        required:true
    },
    // referenceImages:[String]

},{timestamps:true})

export const Listing = mongoose.model("Listing",listingSchema)
