import ProductCategory from "../models/ProductCategory.js";
import validateId from "../utils/validateId.js";

export const createCategory = async (req, res) => {
  try {
    const newCategory = await ProductCategory.create(req.body);
    if (!newCategory) {
      return res.status(400).json({ message: "Invalid content passed" });
    }
    return res.status(200).json(newCategory);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedCategory) {
      return res.status(400).json({ message: "Invalid category id" });
    }
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getCategory = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const category = await ProductCategory.findById(id);
    if (!category) {
      return res.status(400).json({ message: "Invalid category id" });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find();
    if (!categories) {
      return res.status(400).json({ message: "No categories found" });
    }
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const deletedCategory = await ProductCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(400).json({ message: "Invalid category id" });
    }
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
