import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllRoomies, registerRoomie } from "../controllers/roomie.controller.js";

const router = Router()

router.route('/register').post(upload.single("avatar"),registerRoomie)

router.route('/getAllRoomies').get(getAllRoomies)

export default router