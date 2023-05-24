import Product from "../models/Product.js";
import User from "../models/User.js";
import slugify from "slugify";
import validateId from "../utils/validateId.js";

export const createProduct = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getProducts = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeField = ["page", "sort", "limit", "fields"];
    excludeField.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr)).populate("brand");

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) {
        return res.status(404).json({ message: "This page does not exist" });
      }
    }

    const products = await query;

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No product found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  validateId(id);
  try {
    const product = await Product.findById(id).populate("color");
    if (!product) {
      return res.status(404).json({ message: "Invalid product id" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Invalid product id" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Invalid product id" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const addToWishlist = async (req, res) => {
  const { _id } = req.user;
  validateId(_id);
  const { productId } = req.body;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "Invalid user id" });
    }
    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      let updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: productId },
        },
        { new: true }
      );

      return res.status(200).json(updatedUser);
    } else {
      let updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: productId },
        },
        { new: true }
      );

      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const rateProduct = async (req, res) => {
  const { _id } = req.user;
  validateId(_id);
  const { star, productId, comment } = req.body;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Invalid product id" });
    }
    const alreadyRated = product.ratings.find(
      (rating) => rating.postedBy.toString() === _id.toString()
    );

    if (alreadyRated) {
      const updatedRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
    } else {
      const ratedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: { star: star, comment: comment, postedBy: _id },
          },
        },
        { new: true }
      );
    }

    const prod = await Product.findById(productId);
    const totalRating = prod.ratings.length;
    const ratingSum = prod.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    const actualRating = Math.round(ratingSum / totalRating);
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
