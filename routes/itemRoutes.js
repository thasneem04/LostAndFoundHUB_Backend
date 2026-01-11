const express = require("express");
const router = express.Router();
const { createItem, getItems } = require("../controllers/itemController");

// @route POST /api/items
router.post("/", createItem);

// @route GET /api/items
router.get("/", getItems);

module.exports = router;
