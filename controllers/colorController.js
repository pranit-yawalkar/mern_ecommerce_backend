import Color from "../models/Color.js";
import validateId from "../utils/validateId.js";

export const createColor = async (req, res) => {
  try {
    const createdColor = await Color.create(req.body);
    res.json(createdColor);
  } catch (error) {
    throw new Error(error);
  }
};

export const updateColor = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedColor);
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteColor = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const deletedColor = await Color.findByIdAndDelete(id);
    res.json(deletedColor);
  } catch (error) {
    throw new Error(error);
  }
};

export const getColor = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const getaColor = await Color.findById(id);
    res.json(getaColor);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (error) {
    throw new Error(error);
  }
};
