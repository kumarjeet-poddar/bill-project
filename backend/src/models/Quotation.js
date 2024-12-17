import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    quotation_type:{
      type:String
    },
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
