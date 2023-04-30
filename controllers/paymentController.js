import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAYKEY,
  key_secret: process.env.RAZORPAYSECRET,
});

export const checkout = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100,
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  return res.status(200).json(order);
};

export const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId } = req.body;

  return res.status(200).json({ razorpayOrderId, razorpayPaymentId });
};
