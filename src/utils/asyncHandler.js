
function asyncHandler(reqHandler) {
    return (req,res,next)=>{
        try {
            reqHandler(req,res,next)
        } catch (err) {
            next(err)
        }
    }
}

export { asyncHandler }