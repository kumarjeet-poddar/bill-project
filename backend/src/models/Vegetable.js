import mongoose from "mongoose";
const { ObjectId, Decimal128 } = mongoose.Schema.Types;

const vegSchema = new mongoose.Schema({
  cust_id: {
    type: ObjectId,
    ref: "customer",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price_per_kg: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
});

// vegSchema.index({ cust_id: 1, name: 1 }, { unique: true });

const Vegetable = mongoose.model("vegetable", vegSchema);

export default Vegetable;
