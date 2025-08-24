import { ApiRes } from "../utils/ApiRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req,res)=>{
    console.log("health check")
    return res.status(200).json(new ApiRes(200,"okk","everythings fine "))
})

export {healthCheck}
