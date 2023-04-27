import mongoose from "mongoose";

const validateId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid id or id not found" });
  }
};

export default validateId;
