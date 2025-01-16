import Admin from '../models/admin.js';
import Quotation from '../models/Quotation.js';
import Customer from '../models/Customer.js';
import Bill from '../models/Bill.js';

async function add_quotation(req, res) {
  try {
    const { veges, quotation_type } = req.body;
    let quotation = await Quotation.findOne({
      quotation_type: quotation_type.toLowerCase(),
    });

    if (quotation) {
      quotation.vegetables = veges.map((veg) => ({
        name: veg.name,
        price_per_kg: veg.price_per_kg,
        quantity: veg.quantity,
        unit: veg.unit,
      }));
      await quotation.save();
    } else {
      quotation = await Quotation.create({
        quotation_type: quotation_type.toLowerCase(),
        vegetables: veges.map((veg) => ({
          name: veg.name,
          price_per_kg: veg.price_per_kg,
          quantity: veg.quantity,
          unit: veg.unit,
        })),
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Quotation updated successfully',
      quotation,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function get_quotations(req, res) {
  try {
    const { quotation_type } = req.params;
    const quotation = await Quotation.findOne({
      quotation_type: quotation_type.toLowerCase(),
    });

    return res.status(200).json({
      success: true,
      msg: 'Quotations retrieved successfully',
      quotation,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function add_sequence(req, res) {
  try {
    const { vegetables } = req.body;

    const orderSet = new Set();
    const englishNameSet = new Set();
    const hindiNameSet = new Set();
    for (let veg of vegetables) {
      if (orderSet.has(veg.order)) {
        return res
          .status(400)
          .json({ success: false, msg: `Duplicate order found in input: ${veg.order}` });
      }
      orderSet.add(veg.order);

      // Check for duplicate English names
      if (englishNameSet.has(veg.english_name)) {
        return res.status(400).json({
          success: false,
          msg: `Duplicate vegetable English name found: ${veg.english_name}`,
        });
      }
      englishNameSet.add(veg.english_name);

      // Check for duplicate Hindi names
      if (hindiNameSet.has(veg.hindi_name)) {
        return res
          .status(400)
          .json({ success: false, msg: `Duplicate vegetable Hindi name found: ${veg.hindi_name}` });
      }
      hindiNameSet.add(veg.hindi_name);
    }

    let admin = await Admin.findOne();
    if (!admin) {
      admin = new Admin({ vegetables: [] });
    }

    admin.vegetables = vegetables.map((veg) => ({
      english_name: veg.english_name,
      hindi_name: veg.hindi_name,
      order: veg.order,
    }));

    await admin.save();
    res.status(200).json({ success: true, msg: 'Vegetables saved successfully!', data: admin });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function get_sequence(req, res) {
  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ success: true, msg: 'No data found!' });
    }
    res.status(200).json({ success: true, vegetables: admin.vegetables });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function get_requirements(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, msg: 'Date parameter is required' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all bills for the given date
    const bills = await Bill.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const customerIds = [...new Set(bills.map((bill) => bill.customer))]; // Get unique customer IDs
    const customers = await Customer.find({ _id: { $in: customerIds } }, 'username');
    const customerMap = {};
    customers.forEach((customer) => {
      customerMap[customer._id] = customer.username;
    });

    // Build a map of vegetables with quantities for each customer
    const vegetableMap = {};
    bills.forEach((bill) => {
      bill.vegetables.forEach((veg) => {
        if (!vegetableMap[veg.name]) {
          vegetableMap[veg.name] = {};
          customerIds.forEach((id) => (vegetableMap[veg.name][id] = null)); // Initialize with null for relevant customers
        }

        vegetableMap[veg.name][bill.customer] = veg.quantity; // Add the quantity for the customer
      });
    });

    // Construct the final table-like response
    const response = [];
    Object.entries(vegetableMap).forEach(([vegName, customerData]) => {
      const row = { vegetable: vegName };
      customerIds.forEach((id) => {
        row[customerMap[id]] = customerData[id]; // Map customer names to quantities
      });
      response.push(row);
    });

    // Respond with the table-like structure
    res.status(200).json({
      success: true,
      customers: customers.map((c) => c.username),
      data: response,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Internal server error' });
  }
}
export { add_quotation, get_quotations, add_sequence, get_sequence, get_requirements };
