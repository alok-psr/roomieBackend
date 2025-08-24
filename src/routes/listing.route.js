import { registerListing } from "../controllers/listing.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/register').post(upload.single("coverImage"),registerListing)

export default router