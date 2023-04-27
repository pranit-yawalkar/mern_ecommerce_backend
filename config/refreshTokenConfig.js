import jwt from "jsonwebtoken";

const generateRefreshToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  return token;
};

export default generateRefreshToken;
