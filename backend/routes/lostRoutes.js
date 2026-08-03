const express = require("express");

const router = express.Router();

const {
    reportLostItem,
    getAllLostItems,
    getLostItemById
} = require("../controllers/lostController");

router.post("/report", reportLostItem);

router.get("/", getAllLostItems);

router.get("/:id", getLostItemById);

module.exports = router;