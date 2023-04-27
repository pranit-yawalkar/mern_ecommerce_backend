import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "Category",
      type: String,
      required: true,
    },
    brand: {
      type: String,
      //   enum: ["Apple", "Samsung", "Lenovo"],
      required: true,
    },
    color: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],
    tag: {
      type: Array,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
      select: false,
    },
    images: {
      type: Array,
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalRating: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
