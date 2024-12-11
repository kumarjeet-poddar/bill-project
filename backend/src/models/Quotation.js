import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const quotationSchema = new mongoose.Schema(
  {
    vegetables: [
      {
        name: String,
        price_per_kg: Number,
        quantity: Number,
      },
    ],
  }
);

const Quotation = mongoose.model("quotation", quotationSchema);

export default Quotation;
