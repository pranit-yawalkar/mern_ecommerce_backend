import express from "express";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getBlog,
  getBlogs,
  likeBlog,
  updateBlog,
  uploadImages,
} from "../controllers/blogController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { uploadImage, blogImageResize } from "../middlewares/uploadImage.js";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/like", authMiddleware, likeBlog);
router.put("/dislike", authMiddleware, dislikeBlog);

router.put(
  "/upload",
  authMiddleware,
  isAdmin,
  uploadImage.array("images", 2),
  blogImageResize,
  uploadImages
);
router.put("/:id", authMiddleware, isAdmin, updateBlog);

router.get("/:id", getBlog);
router.get("/", getBlogs);

router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

export default router;
