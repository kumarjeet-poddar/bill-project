import Bill from "../models/Bill.js";
import Customer from "../models/Customer.js";
import Vegetable from "../models/Vegetable.js";

// get all bills
async function get_all_bill(req, res) {
  try {
    const { cust_id } = await req.params;

    const bills = await Bill.find({ customer: cust_id })
      .sort({ date: -1 })
      .populate("customer", "username");

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
    const { bill_id, cust_id } = req.params;

    const bill = await Bill.findById(bill_id).populate("customer");

    const all_vegetables = await Vegetable.find({ cust_id });

    return res.status(200).json({
      success: true,
      bill,
      all_vegetables,
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
    const { cust_id, cust_vegetables, total, date, bill_number } = req.body;

    const bill = await Bill.create({
      customer: cust_id,
      vegetables: cust_vegetables.map((veg) => ({
        name: veg.name,
        price_per_kg: veg.price_per_kg,
        quantity: veg.quantity,
      })),
      total_amount: total,
      date,
      bill_number,
    });

    await Customer.findByIdAndUpdate(cust_id, {
      $addToSet: { bills: bill._id },
    });

    return res.status(200).json({
      success: true,
      msg: "Bill generated successfully",
      bill,
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
    const { bill_id } = req.params;
    const { vegetables, total_amount, date, bill_number } = req.body;

    const bill = await Bill.findById(bill_id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    bill.vegetables = vegetables.map((veg) => ({
      name: veg.name,
      price_per_kg: veg.price_per_kg,
      quantity: veg.quantity,
    }));

    bill.total_amount = total_amount;

    if (date && bill_number) {
      bill.date = date;
      bill.bill_number = bill_number;
    }

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

async function get_monthly_bill(req, res) {
  try {
    const { month, year } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const bills = await Bill.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: -1 })
      .populate("customer", "username");

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

async function get_bill_count(req, res) {
  try {

    const billCount = await Bill.countDocuments();

    return res.status(200).json({
      success: true,
      totalBills: billCount,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

export {
  add_bill,
  get_all_bill,
  get_bill,
  edit_bill,
  remove_bill,
  get_monthly_bill,
  get_bill_count
};
