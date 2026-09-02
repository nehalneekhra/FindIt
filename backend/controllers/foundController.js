const FoundItem = require("../models/foundItem");
const fs = require("fs");
const path = require("path");


const reportFoundItem = async (req, res) => {
    try {

        const {
            title,
            description,
            category,
            location,
            dateFound
        } = req.body;


        if (
            !title ||
            !description ||
            !category ||
            !location ||
            !dateFound
        ) {

            return res.status(400).json({

                success: false,
                message: "Please fill all required fields"

            });

        }


        const image = req.file
            ? `/uploads/${req.file.filename}`
            : "";


        const foundItem = await FoundItem.create({

            title,
            description,
            category,
            location,
            dateFound,
            image,

            reportedBy: req.user.id

        });


        res.status(201).json({

            success: true,
            message: "Found Item Reported Successfully",
            foundItem

        });

    } catch (error) {

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

            .populate(
                "reportedBy",
                "name email"
            )

            .sort({
                createdAt: -1
            });


        res.status(200).json({

            success: true,
            count: foundItems.length,
            foundItems

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }
};



const getFoundItemById = async (req, res) => {
    try {

        const foundItem =
            await FoundItem.findById(
                req.params.id
            )

            .populate(
                "reportedBy",
                "name email"
            );


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

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }
};



/* =========================
   UPDATE FOUND ITEM
========================= */

const updateFoundItem = async (req, res) => {
    try {

        const foundItem =
            await FoundItem.findById(
                req.params.id
            );


        if (!foundItem) {

            return res.status(404).json({

                success: false,
                message: "Found Item not found"

            });

        }


        /* =========================
           OWNERSHIP CHECK
        ========================= */

        if (
            foundItem.reportedBy.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                success: false,
                message:
                    "You can only edit your own reports"

            });

        }


        const {
            title,
            description,
            category,
            location,
            dateFound
        } = req.body;


        foundItem.title = title;
        foundItem.description = description;
        foundItem.category = category;
        foundItem.location = location;
        foundItem.dateFound = dateFound;


        /* =========================
           NEW IMAGE
        ========================= */

        if (req.file) {

            const oldImage = foundItem.image;

            foundItem.image =
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


        await foundItem.save();


        res.status(200).json({

            success: true,
            message:
                "Found Item updated successfully",

            foundItem

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
   DELETE FOUND ITEM
========================= */

const deleteFoundItem = async (req, res) => {
    try {

        const foundItem =
            await FoundItem.findById(
                req.params.id
            );


        if (!foundItem) {

            return res.status(404).json({

                success: false,
                message: "Found Item not found"

            });

        }


        if (
            foundItem.reportedBy.toString() !==
            req.user.id
        ) {

            return res.status(403).json({

                success: false,
                message:
                    "You can only delete your own reports"

            });

        }


        if (foundItem.image) {

            const imagePath = path.join(

                __dirname,
                "..",
                foundItem.image.replace(/^\/+/, "")

            );


            if (fs.existsSync(imagePath)) {

                fs.unlinkSync(imagePath);

            }

        }


        await FoundItem.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            success: true,
            message:
                "Found Item deleted successfully"

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

    reportFoundItem,
    getAllFoundItems,
    getFoundItemById,
    updateFoundItem,
    deleteFoundItem

};