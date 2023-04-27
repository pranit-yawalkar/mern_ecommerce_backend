import Coupon from "../models/Coupon.js";
import validateId from "../utils/validateId.js";

export const createCoupon = async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    if (!newCoupon) {
      return res.status(400).json({ message: "Invalid content passed" });
    }
    return res.status(200).json(newCoupon);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    if (!coupons) {
      return res.status(400).json({ message: "No coupons found" });
    }
    return res.status(200).json(coupons);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getCoupon = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon id" });
    }
    return res.status(200).json(coupon);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateCoupon = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCoupon) {
      return res.status(404).json({ message: "Invalid coupon id" });
    }
    return res.status(200).json(updatedCoupon);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Invalid coupon id" });
    }
    return res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
