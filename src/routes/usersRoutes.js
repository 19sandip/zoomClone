import { Router } from 'express';
import { login, register } from '../controllers/user.controller.js';
const router =  Router();
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout");
router.route("/addTOActivity");
router.route("/getAllActivities");

export default router;