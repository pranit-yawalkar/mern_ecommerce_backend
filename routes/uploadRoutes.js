import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { uploadImage, productImageResize } from "../middlewares/uploadImage.js";
import { deleteImages, uploadImages } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadImage.array("images", 10),
  productImageResize,
  uploadImages
);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteImages);

export default router;
