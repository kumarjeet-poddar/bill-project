import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const billSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectId,
      ref: "customer",
      required: true,
    },
    vegetables: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total_amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("bill", billSchema);

export default Bill;
