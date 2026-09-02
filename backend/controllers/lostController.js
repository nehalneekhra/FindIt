const LostItem = require("../models/lostItem");
const fs = require("fs");
const path = require("path");


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
            email
        } = req.body;


        if (
            !title ||
            !description ||
            !category ||
            !location ||
            !dateLost
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

            reportedBy: req.user.id

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

    } catch (error) {

        console.log(error);

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

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }
};



/* =========================
   UPDATE LOST ITEM
========================= */

const updateLostItem = async (req, res) => {
    try {

        const lostItem = await LostItem.findById(req.params.id);


        if (!lostItem) {

            return res.status(404).json({

                success: false,
                message: "Lost Item not found"

            });

        }


        /* =========================
           OWNERSHIP CHECK
        ========================= */

        if (
            lostItem.reportedBy.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                success: false,
                message: "You can only edit your own reports"

            });

        }


        const {
            title,
            description,
            category,
            location,
            dateLost,
            reward,
            phone,
            email
        } = req.body;


        lostItem.title = title;
        lostItem.description = description;
        lostItem.category = category;
        lostItem.location = location;
        lostItem.dateLost = dateLost;
        lostItem.reward = reward || "";
        lostItem.phone = phone || "";
        lostItem.email = email || "";


        /* =========================
           NEW IMAGE
        ========================= */

        if (req.file) {

            const oldImage = lostItem.image;

            lostItem.image =
                `/uploads/${req.file.filename}`;


            /* Delete old image */

            if (oldImage) {

                const oldImagePath = path.join(
                    __dirname,
                    "..",
                    oldImage.replace(/^\/+/, "")
                );


                if (fs.existsSync(oldImagePath)) {

                    fs.unlinkSync(oldImagePath);

                }

            }

        }


        await lostItem.save();


        res.status(200).json({

            success: true,
            message: "Lost Item updated successfully",
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



/* =========================
   DELETE LOST ITEM
========================= */

const deleteLostItem = async (req, res) => {
    try {

        const lostItem =
            await LostItem.findById(req.params.id);


        if (!lostItem) {

            return res.status(404).json({

                success: false,
                message: "Lost Item not found"

            });

        }


        if (
            lostItem.reportedBy.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                success: false,
                message:
                    "You can only delete your own reports"

            });

        }


        if (lostItem.image) {

            const imagePath = path.join(

                __dirname,
                "..",
                lostItem.image.replace(/^\/+/, "")

            );


            if (fs.existsSync(imagePath)) {

                fs.unlinkSync(imagePath);

            }

        }


        await LostItem.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            success: true,
            message: "Lost Item deleted successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }
};



module.exports = {

    reportLostItem,
    getAllLostItems,
    getLostItemById,
    updateLostItem,
    deleteLostItem

};