import Blog from "../models/Blog.js";
import { cloudinaryUploadImage } from "../utils/cloudinary.js";
import validateId from "../utils/validateId.js";
import fs from "fs";

export const createBlog = async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    if (!newBlog) {
      return res.status(400).json({ message: "Invalid content passed" });
    }

    return res.status(200).json(newBlog);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Invalid blog id" });
    }
    return res.status(200).json(updatedBlog);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getBlog = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const blog = await Blog.findById(id).populate("likes").populate("dislikes");
    await Blog.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true });

    if (!blog) {
      return res.status(404).json({ message: "Invalid blog id" });
    }
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs) {
      return res.status(404).json({ message: "No blogs found" });
    }
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deleteBlog) {
      return res.status(404).json({ message: "Invalid blog id" });
    }
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const likeBlog = async (req, res) => {
  const { blogId } = req.body;
  validateId(blogId);
  try {
    const blog = await Blog.findById(blogId);
    const loginUserId = req.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes.find(
      (userId) => userId.toString() === loginUserId.toString()
    );

    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
    }

    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      return res.status(200).json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      return res.status(200).json(blog);
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const dislikeBlog = async (req, res) => {
  const { blogId } = req.body;
  validateId(blogId);
  try {
    const blog = await Blog.findById(blogId);
    const loginUserId = req.user?._id;
    const isDisliked = blog?.isDisliked;
    const alreadyLiked = blog?.likes.find(
      (userId) => userId.toString() === loginUserId.toString()
    );

    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
    }

    if (isDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      return res.status(200).json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      return res.status(200).json(blog);
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const uploadImages = async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const images = urls.map((file) => file);
    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
