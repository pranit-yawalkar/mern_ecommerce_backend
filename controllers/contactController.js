import Contact from "../models/Contact.js";
import validateId from "../utils/validateId.js";

export const createEnquiry = async (req, res) => {
  try {
    const newEnquiry = await Contact.create(req.body);
    res.json(newEnquiry);
  } catch (error) {
    throw new Error(error);
  }
};
export const updateEnquiry = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const updatedEnquiry = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedEnquiry);
  } catch (error) {
    throw new Error(error);
  }
};
export const deleteEnquiry = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const deletedEnquiry = await Contact.findByIdAndDelete(id);
    res.json(deletedEnquiry);
  } catch (error) {
    throw new Error(error);
  }
};
export const getEnquiry = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const getaEnquiry = await Contact.findById(id);
    res.json(getaEnquiry);
  } catch (error) {
    throw new Error(error);
  }
};
export const getallEnquiry = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    throw new Error(error);
  }
};
