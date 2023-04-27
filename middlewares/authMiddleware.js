import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  if (!req.headers?.authorization?.startsWith("Bearer")) {
    return res.status(401).json({ message: "Token is not provided" });
  }
  let token = req.headers.authorization.split(" ")[1];
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded?.id);
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (user.role !== "admin") {
    return res.status(400).json({ message: "You are not an admin" });
  }

  next();
};
