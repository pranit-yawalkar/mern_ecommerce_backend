import {
  cloudinaryUploadImage,
  cloudinaryDeleteImage,
} from "../utils/cloudinary.js";
import fs from "fs";

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

    const images = urls.map((file) => {
      return file;
    });

    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteImages = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImage(id, "images");
    return res.status(200).json(deleted);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
