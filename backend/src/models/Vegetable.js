import mongoose from "mongoose";
const { ObjectId} = mongoose.Schema.Types;

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
  unit: {
    type: String,
  },
});

const Vegetable = mongoose.model("vegetable", vegSchema);

export default Vegetable;
