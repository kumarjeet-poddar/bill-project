import Customer from "../models/Customer.js";
import Vegetable from "../models/Vegetable.js";

async function add_vegetable(req, res) {
  try {
    const { cust_id, name, price, quantity, unit } = req.body;

    const vegetable_exist = await Vegetable.findOne({
      name: name.toLowerCase(),
      cust_id,
    });

    if (vegetable_exist) {
      // vegetable_exist.price_per_kg = price;
      // vegetable_exist.unit = unit;
      // await vegetable_exist.save();
      return res.status(400).json({
        success: false,
        msg: "Vegetable by this name already exists",
        vegetable: vegetable_exist,
      });
    }

    const new_veg = await Vegetable.create({
      name: name.toLowerCase(),
      price_per_kg: price,
      quantity: quantity,
      cust_id: cust_id,
      unit
    });

    await Customer.findByIdAndUpdate(cust_id, {
      $addToSet: { vegetables: new_veg._id },
    });

    return res.status(200).json({
      success: true,
      msg: "New vegetable added",
      vegetable: new_veg,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

async function edit_vegetable(req, res) {
  try {
    const { veg_id, price, quantity, unit } = req.body;

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
        msg: "Vegetable not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Vegetable updated successfully",
      vegetable: updatedVeg,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
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
        msg: "Vegetable not found",
      });
    }

    await Customer.findByIdAndUpdate(cust_id, {
      $pull: { vegetables: veg_id },
    });

    return res.status(200).json({
      success: true,
      msg: "Vegetable removed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}

export { add_vegetable, remove_vegetable, edit_vegetable };
