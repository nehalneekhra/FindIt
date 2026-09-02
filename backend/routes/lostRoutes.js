const express = require("express");
const router = express.Router();

const upload = require("../config/upload");
const protect = require("../middleware/authMiddleware");

const {
    reportLostItem,
    getAllLostItems,
    getLostItemById,
    updateLostItem,
    deleteLostItem
} = require("../controllers/lostController");


router.post(
    "/report",
    protect,
    upload.single("image"),
    reportLostItem
);

router.get(
    "/",
    getAllLostItems
);

router.get(
    "/:id",
    getLostItemById
);

router.put(
    "/:id",
    protect,
    upload.single("image"),
    updateLostItem
);

router.delete(
    "/:id",
    protect,
    deleteLostItem
);


module.exports = router;