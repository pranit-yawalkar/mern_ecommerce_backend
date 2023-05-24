import express from "express";
import {
  addToWishlist,
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  rateProduct,
} from "../controllers/productController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { uploadImage, productImageResize } from "../middlewares/uploadImage.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rateProduct);
// router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

export default router;
