import Customer from '../models/Customer.js';
import Vegetable from '../models/Vegetable.js';
import Bill from '../models/Bill.js';
import Admin from '../models/admin.js';

async function get_all_customer(req, res) {
  try {
    const customers = await Customer.find({}).select('-vegetables -bills');

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function get_customer(req, res) {
  try {
    const { cust_id } = req.params;

    const data = await Customer.findOne({ _id: cust_id })
      .populate({
        path: 'vegetables',
      })
      .select('-bills');
    const admin = await Admin.findOne({}, 'vegetables');
    const admin_vegetables = admin
      ? admin.vegetables.map((veg) => ({
          name: veg.english_name,
          _id: veg._id,
        }))
      : [];

    return res.status(200).json({
      success: true,
      customer: data,
      admin_vegetables,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function add_customer(req, res) {
  try {
    const { username, phone, address, customer_identifier, customer_sequence } = req.body;

    const existingCustomer = await Customer.findOne({
      customer_identifier: customer_identifier.toLowerCase(),
    });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        msg: 'Customer identifier already exists',
      });
    }

    if (customer_sequence) {
      const existingCustomer = await Customer.findOne({
        customer_sequence,
        _id: { $ne: cust_id },
      });
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          msg: 'This customer sequence is already added!',
        });
      }
    }

    const new_user = await Customer.create({
      username,
      phone,
      address,
      customer_identifier: customer_identifier.toLowerCase(),
      customer_sequence,
    });

    return res.status(200).json({
      success: true,
      user: new_user,
      msg: 'New Customer added',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function edit_customer(req, res) {
  try {
    const { cust_id, phone, address, customer_identifier, customer_sequence } = req.body;

    if (customer_identifier) {
      const existingCustomer = await Customer.findOne({
        customer_identifier: customer_identifier.toLowerCase(),
        _id: { $ne: cust_id },
      });
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          msg: 'Customer identifier already exists',
        });
      }
    }

    if (customer_sequence) {
      const existingCustomer = await Customer.findOne({
        customer_sequence,
        _id: { $ne: cust_id },
      });
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          msg: 'This customer sequence is already added!',
        });
      }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      cust_id,
      {
        $set: {
          phone,
          address,
          ...(customer_identifier && { customer_identifier: customer_identifier.toLowerCase() }),
          ...(customer_sequence && { customer_sequence }),
        },
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        msg: 'Customer not found',
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Customer details updated successfully',
      customer: updatedCustomer,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
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
        msg: 'Customer not found',
      });
    }

    await Vegetable.deleteMany({ cust_id: cust_id });

    await Bill.deleteMany({ customer: cust_id });

    await Customer.findByIdAndDelete(cust_id);

    return res.status(200).json({
      success: true,
      msg: 'Customer deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

export { get_all_customer, get_customer, remove_customer, add_customer, edit_customer };
