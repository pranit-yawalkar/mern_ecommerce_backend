import express from "express";
import {
  addToCart,
  blockUser,
  createOrder,
  deleteUser,
  emptyCart,
  getMyOrders,
  getUser,
  getUserCart,
  getUsers,
  getWishlist,
  removeFromCart,
  saveUserAddress,
  unblockUser,
  updateQuantityFromCart,
  updateUser,
} from "../controllers/userController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { checkout, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/getUsers", getUsers);
router.get("/test", (req, res) => {
  return res.status(200).send("route is working fine");
});
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.get("/orders", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, isAdmin, getUser);

router.post("/cart", authMiddleware, addToCart);
// router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post("/cart/create-order", authMiddleware, createOrder);
router.post("/order/checkout", authMiddleware, checkout);
router.post("/order/verify-payment", authMiddleware, verifyPayment);

router.delete("/cart/empty", authMiddleware, emptyCart);
router.delete("/cart/:id", authMiddleware, removeFromCart);
router.delete("/:id", deleteUser);

router.put("/cart/:id", authMiddleware, updateQuantityFromCart);
router.put("/update", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveUserAddress);

router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);

export default router;
