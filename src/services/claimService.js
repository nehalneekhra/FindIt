const BASE_URL = `${import.meta.env.VITE_API_URL}/api/claims`;


const getToken = () => {
    return localStorage.getItem("token");
};


/* =========================
   CREATE CLAIM
========================= */

export const createClaim = async (itemId, message) => {
    try {

        const token = getToken();

        const response = await fetch(
            BASE_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    itemId,
                    message
                })
            }
        );

        return await response.json();

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "Unable to submit claim"
        };

    }
};


/* =========================
   MY CLAIMS
========================= */

export const getMyClaims = async () => {
    try {

        const token = getToken();

        const response = await fetch(
            `${BASE_URL}/my`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return await response.json();

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "Unable to fetch your claims"
        };

    }
};


/* =========================
   RECEIVED CLAIMS
========================= */

export const getReceivedClaims = async () => {
    try {

        const token = getToken();

        const response = await fetch(
            `${BASE_URL}/received`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return await response.json();

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "Unable to fetch received claims"
        };

    }
};


/* =========================
   ACCEPT / REJECT CLAIM
========================= */

export const updateClaimStatus = async (
    claimId,
    status
) => {
    try {

        const token = getToken();

        const response = await fetch(
            `${BASE_URL}/${claimId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    status
                })
            }
        );

        return await response.json();

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "Unable to update claim"
        };

    }
};