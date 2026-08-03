const FoundItem = require("../models/foundItem");

const reportFoundItem = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            location,
            dateFound,
            reportedBy
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !location ||
            !dateFound ||
            !reportedBy
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const foundItem = await FoundItem.create({
            title,
            description,
            category,
            location,
            dateFound,
            reportedBy
        });

        res.status(201).json({
            success: true,
            message: "Found Item Reported Successfully",
            foundItem
        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

const getAllFoundItems = async (req, res) => {
    try {

        const foundItems = await FoundItem.find()
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: foundItems.length,
            foundItems
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const getFoundItemById = async (req, res) => {

    try {

        const foundItem = await FoundItem.findById(req.params.id)
            .populate("reportedBy", "name email");

        if (!foundItem) {
            return res.status(404).json({
                success: false,
                message: "Found Item not found"
            });
        }

        res.status(200).json({
            success: true,
            foundItem
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

module.exports = {
    reportFoundItem,
    getAllFoundItems,
    getFoundItemById
};