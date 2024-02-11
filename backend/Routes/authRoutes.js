import express from "express";
const router = express.Router();

import {
  approveLogin,
  getAllUsers,
  getCurrentUser,
  login,
  logout,
  magicLogin,
  register,
  registerElder,
} from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";
import careTakerMiddleware from "../middleware/careTaker.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);
router.route("/logout").get(logout);
router.route("/getAllUsers").get(careTakerMiddleware, getAllUsers);
router.route("/registerElder").post(careTakerMiddleware, registerElder);
router.route("/magicLogin").post(careTakerMiddleware, magicLogin);
router.route("/login/:token").post(approveLogin);

export default router;
