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
    const sortedVegetables = admin.vegetables.sort((a, b) => a.order - b.order);

    res.status(200).json({ success: true, vegetables: sortedVegetables });
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

    const bills = await Bill.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const customerIds = [...new Set(bills.map((bill) => bill.customer))];

    // Fetch customers sorted by customer_sequence
    const customers = await Customer.find(
      { _id: { $in: customerIds } },
      'username customer_sequence'
    ).sort({ customer_sequence: 1 });
    const customerMap = {};
    customers.forEach((customer) => {
      customerMap[customer._id] = {
        username: customer.username,
        sequence: customer.customer_sequence,
      };
    });

    // Fetch vegetables from Admin collection and sort them by order
    const adminData = await Admin.findOne({}, 'vegetables');
    const adminVegetables = adminData ? adminData.vegetables.map((veg) => veg.english_name) : [];
    const sortedVegetables = adminData
      ? adminData.vegetables.sort((a, b) => a.order - b.order).map((veg) => veg.english_name)
      : [];

    // Build a map of vegetables with quantities for each customer
    const vegetableMap = {};
    bills.forEach((bill) => {
      bill.vegetables.forEach((veg) => {
        if (!vegetableMap[veg.name]) {
          vegetableMap[veg.name] = {};
          customers.forEach((customer) => (vegetableMap[veg.name][customer._id] = null));
        }
        vegetableMap[veg.name][bill.customer] = veg.quantity;
      });
    });

    // Collect vegetables not present in the Admin collection
    const additionalVegetables = Object.keys(vegetableMap).filter(
      (veg) => !adminVegetables.includes(veg)
    );

    // Construct the sorted response
    const response = [];
    [...sortedVegetables, ...additionalVegetables].forEach((vegName) => {
      if (vegetableMap[vegName]) {
        const row = { vegetable: vegName };
        customers.forEach((customer) => {
          row[customer.username] = vegetableMap[vegName][customer._id] || null;
        });
        response.push(row);
      }
    });

    // Respond with sorted data
    res.status(200).json({
      success: true,
      customers: customers.map((c) => c.username),
      data: response,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Internal server error' });
  }
}

async function get_arranged_vegetables(req, res) {
  try {
    const { vegetables } = req.body;

    if (!vegetables || !Array.isArray(vegetables)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid input. 'vegetables' should be an array.",
      });
    }

    // Fetch the vegetable sequence from the Admin model
    const admin = await Admin.findOne({}, 'vegetables');
    if (!admin) {
      return res.status(404).json({
        success: false,
        msg: 'No vegetable sequence found in the Admin model.',
      });
    }

    // Create a map of the order and hindi_name from the Admin model
    const adminVegetableMap = {};
    admin.vegetables.forEach((veg) => {
      adminVegetableMap[veg.english_name.toLowerCase()] = {
        order: veg.order,
        hindi_name: veg.hindi_name,
      };
    });

    // Process the input vegetables array
    const withOrder = []; // Vegetables with order
    const withoutOrder = []; // Vegetables without order

    vegetables.forEach((veg) => {
      const adminData = adminVegetableMap[veg.name.toLowerCase()];
      if (adminData) {
        withOrder.push({
          ...veg,
          hindi_name: adminData.hindi_name,
          order: adminData.order,
        });
      } else {
        withoutOrder.push({ ...veg, hindi_name: null, order: Infinity });
      }
    });

    // Sort vegetables with order and append those without order at the end
    const sortedVegetables = [...withOrder.sort((a, b) => a.order - b.order), ...withoutOrder];

    return res.status(200).json({
      success: true,
      vegetables: sortedVegetables,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

export {
  add_quotation,
  get_quotations,
  add_sequence,
  get_sequence,
  get_requirements,
  get_arranged_vegetables,
};
