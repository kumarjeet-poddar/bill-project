import Customer from '../models/Customer.js';
import Vegetable from '../models/Vegetable.js';

async function add_vegetable(req, res) {
  try {
    const { cust_id, name, price, quantity, unit } = req.body;

    const vegetable_exist = await Vegetable.findOne({
      name: name.toLowerCase(),
      cust_id,
    });

    if (vegetable_exist) {
      vegetable_exist.price_per_kg = price;
      vegetable_exist.unit = unit;
      await vegetable_exist.save();
    } else {
      const new_veg = await Vegetable.create({
        name: name.toLowerCase(),
        price_per_kg: price,
        quantity: quantity,
        cust_id: cust_id,
        unit,
      });

      await Customer.findByIdAndUpdate(cust_id, {
        $addToSet: { vegetables: new_veg._id },
      });
    }

    const customer = await Customer.findById(cust_id)
      .populate('vegetables')
      .select('-bills -username -phone -address -bill_number');

    const customer_vegetables = customer.vegetables;

    if (vegetable_exist) {
      return res.status(400).json({
        success: false,
        msg: 'Vegetable by this name already exists',
        vegetable: vegetable_exist,
        customer_vegetables,
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'New vegetable added',
      vegetable: new_veg,
      customer_vegetables,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function edit_vegetable(req, res) {
  try {
    const { cust_id, veg_id, price, quantity, unit } = req.body;

    const updatedVeg = await Vegetable.findByIdAndUpdate(
      veg_id,
      {
        $set: {
          ...(price && { price_per_kg: price }),
          ...(quantity && { quantity: quantity }),
          ...(unit && { unit: unit }),
        },
      },
      { new: true }
    );

    if (!updatedVeg) {
      return res.status(404).json({
        success: false,
        msg: 'Vegetable not found',
      });
    }

    const customer = await Customer.findById(cust_id)
      .populate('vegetables')
      .select('-bills -username -phone -address -bill_number');

    const customer_vegetables = customer.vegetables;

    return res.status(200).json({
      success: true,
      msg: 'Vegetable updated successfully',
      vegetable: updatedVeg,
      customer_vegetables,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function remove_vegetable(req, res) {
  try {
    const { cust_id, veg_id } = req.params;

    const deletedVeg = await Vegetable.findByIdAndDelete(veg_id);

    if (!deletedVeg) {
      return res.status(404).json({
        success: false,
        msg: 'Vegetable not found',
      });
    }

    await Customer.findByIdAndUpdate(cust_id, {
      $pull: { vegetables: veg_id },
    });

    return res.status(200).json({
      success: true,
      msg: 'Vegetable removed successfully',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

async function edit_bill_vegetable(req, res) {
  try {
    const { cust_id, name, price, unit } = req.body;

    // Find the vegetable by name and customer ID
    const vegetable = await Vegetable.findOne({ name: name.toLowerCase(), cust_id });

    if (!vegetable) {
      return res.status(404).json({
        success: false,
        msg: 'Vegetable not found for the given customer',
      });
    }

    // Update the vegetable details
    const updatedVeg = await Vegetable.findByIdAndUpdate(
      vegetable._id,
      {
        $set: {
          ...(price && { price_per_kg: price }),
          ...(unit && { unit }),
        },
      },
      { new: true }
    );

    // Fetch updated customer vegetables
    const customer = await Customer.findById(cust_id)
      .populate('vegetables')
      .select('-bills -username -phone -address -bill_number');

    return res.status(200).json({
      success: true,
      msg: 'Vegetable updated successfully',
      vegetable: updatedVeg,
      customer_vegetables: customer?.vegetables || [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
}

export { add_vegetable, remove_vegetable, edit_vegetable, edit_bill_vegetable };
