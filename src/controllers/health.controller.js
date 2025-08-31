import { ApiRes } from "../utils/ApiRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req,res)=>{
    try {
        console.log("health check")
        return res.status(200).json(new ApiRes(200,"okk","everythings fine "))
    } catch (error) {
        console.log("healthCheck ERR ", error)
    }
})

export {healthCheck}
