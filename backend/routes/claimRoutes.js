const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createClaim,
    getReceivedClaims,
    getMyClaims,
    updateClaimStatus
} = require("../controllers/claimController");


router.post(
    "/",
    protect,
    createClaim
);


router.get(
    "/received",
    protect,
    getReceivedClaims
);


router.get(
    "/my",
    protect,
    getMyClaims
);


router.put(
    "/:id/status",
    protect,
    updateClaimStatus
);


module.exports = router;