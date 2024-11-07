import Customer from "../models/Customer.js";
import Vegetable from "../models/Vegetable.js";

async function add_vegetable(req, res) {
  try {
    const { cust_id, name, price, quantity } = req.body;

    const is_exist = await Vegetable.findOne({
      name,
      cust_id
    });

    if (is_exist) {
      return res.status(400).json({
        success: false,
        msg: "Vegetable by this name already exists",
        vegetable: is_exist,
      });
    }

    const new_veg = await Vegetable.create({
      name: name,
      price_per_kg: price,
      quantity: quantity,
      cust_id: cust_id,
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
    const { veg_id, price, quantity } = req.body;

    const updatedVeg = await Vegetable.findByIdAndUpdate(
      veg_id,
      {
        $set: {
          ...(price && { price_per_kg: price }),
          ...(quantity && { quantity: quantity }),
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
