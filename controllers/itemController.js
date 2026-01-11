const Item = require("../models/Item");

// Create a new item (POST)
const createItem = async (req, res) => {
  try {
    const { name, description, contact, status } = req.body;

    // Create a new item document
    const newItem = new Item({
      name,
      description,
      contact,
      status,
    });

    await newItem.save();
    res.status(201).json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Error creating item", error: error.message });
  }
};

// Get all items (GET)
const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 }); // newest first
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

module.exports = { createItem, getItems };
