import Admin from '../models/admin.js';
import Quotation from '../models/Quotation.js';

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
    for (let veg of vegetables) {
      if (orderSet.has(veg.order)) {
        return res
          .status(400)
          .json({ success: false, msg: `Duplicate order found in input: ${veg.order}` });
      }
      orderSet.add(veg.order);
    }

    let admin = await Admin.findOne();
    if (!admin) {
      admin = new Admin({ vegetables: [] });
    }

    admin.vegetables = vegetables.map((veg) => ({
      english_name: veg.englishName,
      hindi_name: veg.hindiName,
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

export { add_quotation, get_quotations, add_sequence, get_sequence };
