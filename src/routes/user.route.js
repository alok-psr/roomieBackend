import Router from "express"
import { getAllUsers, getUser, likeRoomie, loginUser, registerUser, updateUserProfile } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/updateUser').put(upload.single('avatar'),updateUserProfile);
router.route('/getAllUsers').get(getAllUsers)
router.route('/getUser').put(getUser)
router.route('/likeRoomie').put(likeRoomie)

export default router