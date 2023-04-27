import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/productCategoryController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);

router.put("/:id", authMiddleware, isAdmin, updateCategory);

router.get("/:id", getCategory);
router.get("/", getCategories);

router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

export default router;
