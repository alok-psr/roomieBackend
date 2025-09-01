import Router from "express"
import { getAllUsers, loginUser, registerUser, updateUserProfile } from "../controllers/user.controller.js"

const router = Router()

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/updateUser').put(updateUserProfile);
router.route('/getAllUsers').get(getAllUsers)

export default router