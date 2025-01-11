import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    vegetables: [
      {
        english_name: String,
        hindi_name:String,
        order:Number
      },
    ],
  }
);

const Admin = mongoose.model("admin", adminSchema);

export default Admin;

// can move quotation to this model