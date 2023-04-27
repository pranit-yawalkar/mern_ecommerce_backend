import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { dbConnect } from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";
import blogRoutes from "./routes/blogRoutes.js";
import productCategoryRoutes from "./routes/productCategoryRoutes.js";
import blogCategoryRoutes from "./routes/blogCategoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import colorRoutes from "./routes/colorRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

dbConnect();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/product-category", productCategoryRoutes);
app.use("/api/blog-category", blogCategoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/color", colorRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
