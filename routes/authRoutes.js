import express from "express";
import {
  forgotPasswordToken,
  handleRefreshToken,
  loginUser,
  logoutUser,
  registerUser,
  updatePassword,
  resetPassword,
  loginAdmin,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);

router.put("/password", authMiddleware, updatePassword);

export default router;
