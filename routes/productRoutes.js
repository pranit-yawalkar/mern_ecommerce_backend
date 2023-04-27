import express from "express";
import {
  addToWishlist,
  createProduct,
  deleteImages,
  deleteProduct,
  getProduct,
  getProducts,
  rateProduct,
  uploadImages,
} from "../controllers/productController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { uploadImage, productImageResize } from "../middlewares/uploadImage.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rateProduct);
router.put(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadImage.array("images", 10),
  productImageResize,
  uploadImages
);
// router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.delete("/image/:id", authMiddleware, isAdmin, deleteImages);

export default router;
