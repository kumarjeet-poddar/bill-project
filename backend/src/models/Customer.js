import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  vegetables: [
    {
      type: ObjectId,
      ref: "vegetable",
    },
  ],
  bills: [
    {
      type: ObjectId,
      ref: "bill",
    },
  ],
  bill_number:{
    type:Number,
    default:1
  }
});

const Customer = mongoose.model("customer", userSchema);

export default Customer;
