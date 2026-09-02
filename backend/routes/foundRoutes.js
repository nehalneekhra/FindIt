const express = require("express");
const router = express.Router();

const upload = require("../config/upload");
const protect = require("../middleware/authMiddleware");

const {
    reportFoundItem,
    getAllFoundItems,
    getFoundItemById,
    updateFoundItem,
    deleteFoundItem
} = require("../controllers/foundController");


router.post(
    "/report",
    protect,
    upload.single("image"),
    reportFoundItem
);

router.get(
    "/",
    getAllFoundItems
);

router.get(
    "/:id",
    getFoundItemById
);

router.put(
    "/:id",
    protect,
    upload.single("image"),
    updateFoundItem
);

router.delete(
    "/:id",
    protect,
    deleteFoundItem
);


module.exports = router;