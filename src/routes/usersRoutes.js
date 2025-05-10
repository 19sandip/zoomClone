import { Router } from 'express';
import { login, register, logout, addUserHistory, getUserHistory } from '../controllers/user.controller.js';
const router =  Router();
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").post(logout);
router.route("/addToActivity").post(addUserHistory);
router.route("/getAllActivities").get(getUserHistory);

export default router;