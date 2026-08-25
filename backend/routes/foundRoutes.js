const express = require("express");

const router = express.Router();

const {
    reportFoundItem,
    getAllFoundItems,
    getFoundItemById
} = require("../controllers/foundController");

const upload = require("../config/upload");

router.post(
    "/report",
    upload.single("image"),
    reportFoundItem
);

router.get("/", getAllFoundItems);

router.get("/:id", getFoundItemById);

module.exports = router;