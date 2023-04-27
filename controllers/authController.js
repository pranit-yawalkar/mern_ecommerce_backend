import User from "../models/User.js";
import genereateToken from "../config/jwtConfig.js";
import generateRefreshToken from "../config/refreshTokenConfig.js";
import jwt from "jsonwebtoken";
import validateId from "../utils/validateId.js";
import sendEmail from "./emailController.js";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const newUser = await User.create(req.body);
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordMatched(password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const refreshToken = generateRefreshToken(user._id);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    const token = genereateToken(user._id);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    if (!admin || !(await admin.isPasswordMatched(password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (admin.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const refreshToken = generateRefreshToken(admin._id);
    const updatedAdmin = await User.findByIdAndUpdate(
      admin._id,
      {
        refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    const token = genereateToken(admin._id);
    return res.status(200).json({ admin, token });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(400).json({ message: "No Refresh Token in Cookies" });
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const updatedUser = await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({ message: "Logged out successfully!" });
};

export const handleRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({ message: "No Refresh Token in Cookies" });
    }
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid refresh token or no refresh token found" });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user._id.toString() !== decoded.id) {
        return res.status(400).json({ message: "Invalid refresh token" });
      }
      const accessToken = genereateToken(user._id);
      return res.status(200).json({ accessToken });
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updatePassword = async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateId(_id);
  try {
    const user = await User.findById(_id);
    if (!password) {
      return res.status(400).json({ message: "Please provide new password" });
    }

    user.password = password;
    const updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const forgotPasswordToken = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes. <a href="${process.env.CLIENT_URL}reset-password/${token}">Click Here</a>`;

    const data = {
      to: email,
      subject: "Reset your password",
      text: `Hey, ${user.firstName}`,
      htm: resetUrl,
    };

    sendEmail(data);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const resetPassword = async (req, res) => {
  console.log(req.body);
  console.log(req.params);

  const { password } = req.body;
  const { token } = req.params;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token expired Please try again later." });
    }

    user.password = password;
    (user.passwordResetToken = undefined),
      (user.passwordResetExpires = undefined);
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
