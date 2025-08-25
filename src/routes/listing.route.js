import { registerListing, getAllListing } from "../controllers/listing.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/register').post(upload.single("coverImage"),registerListing)

router.route('/allListings').get(getAllListing)

export default router