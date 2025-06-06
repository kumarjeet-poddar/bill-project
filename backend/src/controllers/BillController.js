import Admin from '../models/admin.js';
import Bill from '../models/Bill.js';
import Customer from '../models/Customer.js';
import Vegetable from '../models/Vegetable.js';
import dayjs from 'dayjs';

// get all bills
async function get_all_bill(req, res) {
  try {
    const { cust_id } = await req.params;

    const bills = await Bill.find({ customer: cust_id })
      .sort({ date: -1 })
      .populate('customer', 'username')
      .select('-vegetables');

    return res.status(200).json({
      success: true,
      bills,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

//  get bill
async function get_bill(req, res) {
  try {
    const { bill_id, cust_id } = req.params;

    const bill = await Bill.findById(bill_id).populate({
      path: 'customer',
      select: '-vegetables -bills',
    });

    const admin = await Admin.findOne({}, 'vegetables');
    const admin_vegetables = admin
      ? admin.vegetables.map((veg) => ({
          name: veg.english_name,
          _id: veg._id,
        }))
      : [];

    const customer_vegetables = await Vegetable.find({ cust_id });

    return res.status(200).json({
      success: true,
      bill,
      customer_vegetables,
      admin_vegetables,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

//  save bill
async function add_bill(req, res) {
  try {
    const { cust_id, cust_vegetables, total, date, bill_number } = req.body;

    const is_Exist = await Bill.findOne({
      bill_number: bill_number.toLowerCase(),
    });

    if (is_Exist) {
      return res.status(400).json({
        success: false,
        msg: 'This Bill Number is already generated',
      });
    }

    const bill = await Bill.create({
      customer: cust_id,
      vegetables: cust_vegetables.map((veg) => ({
        name: veg.name,
        price_per_kg: veg.price_per_kg,
        quantity: veg.quantity,
        unit: veg.unit,
      })),
      total_amount: total,
      date,
      bill_number: bill_number.toLowerCase(),
    });

    const customer = await Customer.findById(cust_id);

    await Customer.findByIdAndUpdate(cust_id, {
      $addToSet: { bills: bill._id },
      bill_number: customer.bill_number + 1,
    });

    return res.status(200).json({
      success: true,
      msg: 'Bill generated successfully',
      bill,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
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
      return res.status(404).json({ message: 'Bill not found' });
    }

    bill.vegetables = vegetables.map((veg) => ({
      name: veg.name,
      price_per_kg: veg.price_per_kg,
      quantity: veg.quantity,
      unit: veg.unit,
    }));

    bill.total_amount = total_amount;

    if (date && bill_number) {
      bill.date = date;
      bill.bill_number = bill_number.toLowerCase();
    }

    await bill.save();

    return res.status(200).json({
      success: true,
      msg: 'Bill updated successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
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
        msg: 'Bill not found',
      });
    }

    await Customer.findByIdAndUpdate(cust_id, {
      $pull: { bills: bill_id },
    });

    return res.status(200).json({
      success: true,
      msg: 'Bill deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function get_monthly_bill(req, res) {
  try {
    const { start_date, end_date, cust_id } = await req.query;

    const parsed_start_date = new Date(decodeURIComponent(start_date));
    const parsed_end_date = new Date(decodeURIComponent(end_date));

    const startOfDay = new Date(parsed_start_date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsed_end_date.setHours(23, 59, 59, 999));

    const bills = await Bill.find({
      customer: cust_id,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate({
        path: 'customer',
        select: '-vegetables -bills',
      })
      .select('-vegetables');

    if (!bills.length) {
      return res.status(400).json({
        success: false,
        msg: 'No bills found for the given date.',
      });
    }

    return res.status(200).json({
      success: true,
      bills,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

export { add_bill, get_all_bill, get_bill, edit_bill, remove_bill, get_monthly_bill };
