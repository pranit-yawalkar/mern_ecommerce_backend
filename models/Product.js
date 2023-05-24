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
      type: mongoose.Schema.Types.ObjectId,
      //   enum: ["Apple", "Samsung", "Lenovo"],
      ref: "Brand",
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
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
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
