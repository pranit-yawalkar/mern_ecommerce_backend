import express from "express";
import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrand,
  updateBrand,
} from "../controllers/brandController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand);

router.put("/:id", authMiddleware, isAdmin, updateBrand);

router.get("/:id", getBrand);
router.get("/", getBrands);

router.delete("/:id", authMiddleware, isAdmin, deleteBrand);

export default router;
