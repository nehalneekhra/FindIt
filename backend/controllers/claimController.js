const Claim = require("../models/claim");
const FoundItem = require("../models/foundItem");
const Notification = require("../models/notification");


/*
 * Remove private contact details unless
 * the claim has been accepted.
 */
const protectClaimContact = (claim) => {
    if (!claim || claim.status === "accepted") {
        return claim;
    }

    if (claim.claimant) {
        claim.claimant.email = undefined;
        claim.claimant.phone = undefined;
    }

    if (claim.finder) {
        claim.finder.email = undefined;
        claim.finder.phone = undefined;
    }

    return claim;
};


/*
 * CREATE CLAIM
 */
const createClaim = async (req, res) => {
    try {
        const { itemId, message } = req.body;

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "Item ID is required"
            });
        }

        const foundItem = await FoundItem.findById(itemId);

        if (!foundItem) {
            return res.status(404).json({
                success: false,
                message: "Found item not found"
            });
        }

        if (foundItem.reportedBy.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot claim your own report"
            });
        }

        if (foundItem.status === "claimed") {
            return res.status(400).json({
                success: false,
                message: "This item has already been claimed"
            });
        }

        const existingClaim = await Claim.findOne({
            item: itemId,
            claimant: req.user.id,
            status: "pending"
        });

        if (existingClaim) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending claim for this item"
            });
        }

        const claim = await Claim.create({
            item: itemId,
            claimant: req.user.id,
            finder: foundItem.reportedBy,
            message: message || ""
        });

        const populatedClaim =
            await Claim.findById(claim._id)
                .populate(
                    "claimant",
                    "name email phone profileImage"
                )
                .populate(
                    "finder",
                    "name email phone profileImage"
                )
                .populate("item");

        /*
         * Notify the finder about the new claim.
         */
        try {
            await Notification.create({
                recipient: foundItem.reportedBy,
                type: "new_claim",
                title: "New Claim Request",
                message: `Someone has submitted a claim for "${foundItem.title}".`,
                relatedClaim: claim._id,
                relatedItem: foundItem._id
            });
        } catch (notificationError) {
            console.log(
                "Notification creation failed:",
                notificationError
            );
        }

        res.status(201).json({
            success: true,
            message: "Claim submitted successfully",
            claim: protectClaimContact(populatedClaim)
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


/*
 * GET CLAIMS RECEIVED BY FINDER
 */
const getReceivedClaims = async (req, res) => {
    try {
        const claims = await Claim.find({
            finder: req.user.id
        })
            .populate(
                "claimant",
                "name email phone profileImage"
            )
            .populate("item")
            .sort({ createdAt: -1 });

        const safeClaims = claims.map(claim =>
            protectClaimContact(claim)
        );

        res.status(200).json({
            success: true,
            count: safeClaims.length,
            claims: safeClaims
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


/*
 * GET CLAIMS SUBMITTED BY USER
 */
const getMyClaims = async (req, res) => {
    try {
        const claims = await Claim.find({
            claimant: req.user.id
        })
            .populate(
                "finder",
                "name email phone profileImage"
            )
            .populate("item")
            .sort({ createdAt: -1 });

        const safeClaims = claims.map(claim =>
            protectClaimContact(claim)
        );

        res.status(200).json({
            success: true,
            count: safeClaims.length,
            claims: safeClaims
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


/*
 * ACCEPT / REJECT CLAIM
 */
const updateClaimStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid claim status"
            });
        }

        const claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });
        }

        /*
         * Only the person who found the item
         * can accept or reject the claim.
         */
        if (claim.finder.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Only the finder can respond to this claim"
            });
        }

        if (claim.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "This claim has already been processed"
            });
        }

        claim.status = status;

        await claim.save();


        /*
         * ACCEPTED
         */
        if (status === "accepted") {

            /*
             * Mark the found item as claimed.
             */
            await FoundItem.findByIdAndUpdate(
                claim.item,
                {
                    status: "claimed"
                }
            );


            /*
             * Only one claimant can win an item.
             *
             * Any other pending claims for this
             * item are automatically rejected.
             */
            const otherPendingClaims =
                await Claim.find({
                    item: claim.item,
                    _id: {
                        $ne: claim._id
                    },
                    status: "pending"
                });

            if (otherPendingClaims.length > 0) {

                await Claim.updateMany(
                    {
                        item: claim.item,
                        _id: {
                            $ne: claim._id
                        },
                        status: "pending"
                    },
                    {
                        $set: {
                            status: "rejected"
                        }
                    }
                );


                /*
                 * Notify all other claimants.
                 */
                for (const otherClaim of otherPendingClaims) {

                    try {

                        await Notification.create({
                            recipient: otherClaim.claimant,
                            type: "claim_rejected",
                            title: "Claim Rejected",
                            message:
                                "Your claim was closed because another claim for this item was accepted.",
                            relatedClaim: otherClaim._id,
                            relatedItem: claim.item
                        });

                    } catch (notificationError) {

                        console.log(
                            "Notification creation failed:",
                            notificationError
                        );

                    }
                }
            }
        }


        /*
         * Get the updated claim with user details.
         */
        const updatedClaim =
            await Claim.findById(claim._id)
                .populate(
                    "claimant",
                    "name email phone profileImage"
                )
                .populate(
                    "finder",
                    "name email phone profileImage"
                )
                .populate("item");


        /*
         * Notify the claimant about the result.
         */
        try {

            const itemTitle =
                updatedClaim.item?.title ||
                "your claimed item";

            if (status === "accepted") {

                await Notification.create({
                    recipient: claim.claimant,
                    type: "claim_accepted",
                    title: "Claim Accepted",
                    message:
                        `Your claim for "${itemTitle}" has been accepted.`,
                    relatedClaim: claim._id,
                    relatedItem: claim.item
                });

            } else {

                await Notification.create({
                    recipient: claim.claimant,
                    type: "claim_rejected",
                    title: "Claim Rejected",
                    message:
                        `Your claim for "${itemTitle}" was rejected.`,
                    relatedClaim: claim._id,
                    relatedItem: claim.item
                });

            }

        } catch (notificationError) {

            console.log(
                "Notification creation failed:",
                notificationError
            );

        }


        res.status(200).json({
            success: true,
            message:
                status === "accepted"
                    ? "Claim accepted successfully"
                    : "Claim rejected successfully",
            claim: updatedClaim
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
    createClaim,
    getReceivedClaims,
    getMyClaims,
    updateClaimStatus
};