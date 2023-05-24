import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Submitted",
      enum: ["Submitted", "Contacted", "In Progress", "Resolved"],
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
