const express = require("express");

const router = express.Router();

const {
    reportFoundItem,
    getAllFoundItems,
    getFoundItemById
} = require("../controllers/foundController");

router.post("/report", reportFoundItem);

router.get("/", getAllFoundItems);

router.get("/:id", getFoundItemById);

module.exports = router;