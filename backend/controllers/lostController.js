const LostItem = require("../models/lostItem");

const reportLostItem = async (req, res) => {
    try {

        const {
    title,
    description,
    category,
    location,
    dateLost,
    reward,
    phone,
    email,
    reportedBy
} = req.body;

        // Validation
        if (
            !title ||
            !description ||
            !category ||
            !location ||
            !dateLost ||
            !reportedBy
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const image = req.file
    ? `/uploads/${req.file.filename}`
    : "";

const lostItem = await LostItem.create({
    title,
    description,
    category,
    location,
    dateLost,
    reward,
    phone,
    email,
    image,
    reportedBy
});

        res.status(201).json({
            success: true,
            message: "Lost Item Reported Successfully",
            lostItem
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const getAllLostItems = async (req, res) => {
    try {

        const lostItems = await LostItem.find()
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: lostItems.length,
            lostItems
        });

    } catch {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const getLostItemById = async (req, res) => {

    try {

        const lostItem = await LostItem.findById(req.params.id)
            .populate("reportedBy", "name email");

        if (!lostItem) {
            return res.status(404).json({
                success: false,
                message: "Lost Item not found"
            });
        }

        res.status(200).json({
            success: true,
            lostItem
        });

    } catch  {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

module.exports = {
    reportLostItem,
    getAllLostItems,
    getLostItemById
};