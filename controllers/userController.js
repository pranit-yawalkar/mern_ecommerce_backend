import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import validateId from "../utils/validateId.js";

import uniqid from "uniqid";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateUser = async (req, res) => {
  const { _id } = req.user;
  validateId(_id);
  const { firstName, lastName, mobile } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        mobile,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const user = await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const blockUser = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );

    return res.status(200).json({ message: "User blocked" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const unblockUser = async (req, res) => {
  const { id } = req.params;
  validateId(id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );

    res.status(200).json({ message: "User unblocked" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const saveUserAddress = async (req, res) => {
  const { _id } = req.user;
  validateId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getWishlist = async (req, res) => {
  const { _id } = req.user;
  validateId(_id);
  try {
    const user = await User.findById(_id).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.wishlist);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const addToCart = async (req, res) => {
  const { productId, color, quantity, price } = req.body;
  const { _id } = req.user;
  validateId(_id);
  try {
    let newCart = await new Cart({
      userId: _id,
      productId,
      color,
      price,
      quantity,
    }).save();

    return res.status(200).json(newCart);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateQuantityFromCart = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const { quantity } = req.body;
  validateId(_id);
  try {
    const cartItem = await Cart.findOne({
      userId: _id,
      _id: id,
    });
    cartItem.quantity = quantity;
    cartItem.save();
    return res.status(200).json(cartItem);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const removeFromCart = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  validateId(_id);
  try {
    const deletedProduct = await Cart.deleteOne({
      userId: _id,
      _id: id,
    });
    return res.status(200).json({ message: "Product removed from cart!" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getUserCart = async (req, res) => {
  const { _id } = req.user;
  validateId(_id);

  try {
    const cart = await Cart.find({ userId: _id })
      .populate("productId")
      .populate("color");
    if (!cart) {
      return res.status(404).json({ message: "No cart present" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const emptyCart = async (req, res) => {
  const { _id } = req.user;
  validateId(_id);

  try {
    const cart = await Cart.findOneAndRemove({ userId: _id });
    if (!cart) {
      return res.status(404).json({ message: "Invalid user" });
    }
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// export const applyCoupon = async (req, res) => {
//   const { coupon } = req.body;
//   const { _id } = req.user;
//   try {
//     const validCoupon = await Coupon.findOne({ name: coupon });
//     if (!validCoupon) {
//       return res.status(404).json({ message: "Invalid coupon" });
//     }
//     const user = await User.findById(_id);
//     let { cartTotal } = await Cart.findOne({
//       orderBy: user._id,
//     }).populate("products.product");

//     let totalAfterDiscount = (
//       cartTotal -
//       (cartTotal * validCoupon.discount) / 100
//     ).toFixed(2);
//     await Cart.findOneAndUpdate(
//       { orderBy: user._id },
//       { totalAfterDiscount },
//       { new: true }
//     );
//     return res.status(200).json(totalAfterDiscount);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };

// export const getOrders = async (req, res) => {
//   const { _id } = req.user;
//   validateId(_id);
//   try {
//     const orders = await Order.findOne({ orderBy: _id })
//       .populate("products.product")
//       .exec();
//     if (!orders) {
//       return res.status(404).json({ message: "No orders found" });
//     }

//     return res.status(200).json(orders);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };

// export const updateOrderStatus = async (req, res) => {
//   const { status } = req.body;
//   const { id } = req.params;
//   validateId(id);
//   try {
//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ message: "Invalid order id" });
//     }
//     const updatedOrder = await Order.findByIdAndUpdate(
//       id,
//       {
//         orderStatus: status,
//         paymentIntent: {
//           status: status,
//         },
//       },
//       { new: true }
//     );

//     return res.status(200).json(updatedOrder);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };

export const createOrder = async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
    paymentInfo,
  } = req.body;
  const { _id } = req.user;

  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      paymentInfo,
      user: _id,
    });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getMyOrders = async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  try {
    const orders = await Order.find({ user: _id })
      .populate("user")
      .populate("orderItems.product")
      .populate("orderItems.color")
      .sort("-createdAt");
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json(error);
  }
};
