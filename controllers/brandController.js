import Brand from "../models/Brand.js";
import validateId from "../utils/validateId.js";

export const createBrand = async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    if (!newBrand) {
      return res.status(400).json({ message: "Invalid content passed" });
    }
    return res.status(200).json(newBrand);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateBrand = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBrand) {
      return res.status(400).json({ message: "Invalid brand id" });
    }
    return res.status(200).json(updatedBrand);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getBrand = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(400).json({ message: "Invalid brand id" });
    }
    return res.status(200).json(brand);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    if (!brands) {
      return res.status(400).json({ message: "No brands found" });
    }
    return res.status(200).json(brands);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteBrand = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return res.status(400).json({ message: "Invalid brand id" });
    }
    return res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
