import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

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
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  }
});

// vegSchema.index({ cust_id: 1, name: 1 }, { unique: true });

const Vegetable = mongoose.model("vegetable", vegSchema);

export default Vegetable;
