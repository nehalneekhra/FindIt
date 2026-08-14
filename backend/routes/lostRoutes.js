const express = require("express");

const router = express.Router();

const upload = require("../config/upload");

const {
    reportLostItem,
    getAllLostItems,
    getLostItemById
} = require("../controllers/lostController");

router.post(
    "/report",
    upload.single("image"),
    reportLostItem
);

router.get("/", getAllLostItems);

router.get("/:id", getLostItemById);

module.exports = router;