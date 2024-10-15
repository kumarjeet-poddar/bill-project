import Bill from "../models/Bill.js";
import Customer from "../models/Customer.js";

// get all bills
async function get_all_bill(req, res) {
  try {
    const { cust_id } = await req;

    const bills = await Customer.findOne({ _id: cust_id }).populate({
      path: "bills",
    });

    return res.status(200).json({
      success: true,
      bills,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

//  get bill
async function get_bill(req, res) {
  try {
    const { bill_id } = req.params;

    const bill = await Bill.findById(bill_id)
      .populate("customer")

    return res.status(200).json({
      success: true,
      bill,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

//  save bill
async function add_bill(req, res) {
  try {
    const { cust_id, cust_vegetables, total } = req.body;

    const newBill = new Bill({
      customer: cust_id,
      vegetables: cust_vegetables.map((veg) => ({
        name: veg.name,
        price: veg.price,
        quantity: veg.quantity,
      })),
      totalPrice: total,
    });

    const savedBill = await newBill.save();

    await Customer.findByIdAndUpdate(
      cust_id,
      { $push: { bills: savedBill._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "Bill generated successfully",
      bill: savedBill,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

//  edit bill
async function edit_bill(req, res) {
  try {
    const { billId } = req.params;
    const { vegetables } = req.body;

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    bill.vegetables = vegetables.map((veg) => ({
      name: veg.name,
      price: veg.price,
      quantity: veg.quantity,
    }));

    await bill.save();

    return res.status(200).json({
      success: true,
      msg: "Bill updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

async function remove_bill(req, res) {
  try {
    const { bill_id, cust_id } = req.params;

    const deletedBill = await Bill.findByIdAndDelete(bill_id);

    if (!deletedBill) {
      return res.status(404).json({
        success: false,
        msg: "Bill not found",
      });
    }

    await Customer.findByIdAndUpdate(cust_id, {
      $pull: { bills: bill_id },
    });

    return res.status(200).json({
      success: true,
      msg: "Bill deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

export { add_bill, get_all_bill, get_bill, edit_bill, remove_bill };
