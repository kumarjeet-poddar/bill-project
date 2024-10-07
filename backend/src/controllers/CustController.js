import Customer from "../models/Customer.js";
import Vegetable from "../models/Vegetable.js";

async function get_all_customer(req, res) {
  try {
    const customers = await Customer.find({});

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

async function get_customer(req, res) {
  try {
    const { cust_id } = req.params;

    const data = await Customer.findOne({ _id: cust_id }).populate({
      path: "vegetables",
    });

    return res.status(200).json({
      success: true,
      customer: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

async function add_customer(req, res) {
  try {
    const { username, phone, address } = req.body;

    const new_user = await Customer.create({
      username: username,
      phone,
      address,
    });

    return res.status(200).json({
      success: true,
      user: new_user,
      msg: "New Customer added",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

async function edit_customer(req, res) {
  try {
    const { cust_id, phone, address } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      cust_id,
      {
        $set: {
          phone: phone,
          address: address,
        },
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        msg: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Customer details updated successfully",
      customer: updatedCustomer,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

async function remove_customer(req, res) {
  try {
    const { cust_id } = req.params;

    const customer = await Customer.findById(cust_id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        msg: "Customer not found",
      });
    }

    await Vegetable.deleteMany({ cust_id: cust_id });

    await Customer.findByIdAndDelete(cust_id);

    return res.status(200).json({
      success: true,
      msg: "Customer deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

export { get_all_customer, get_customer, remove_customer, add_customer, edit_customer };
