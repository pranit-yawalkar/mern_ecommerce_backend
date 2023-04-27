import mongoose from "mongoose";

export const dbConnect = () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI)
      .then((res) => {
        console.log("Database connected successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
