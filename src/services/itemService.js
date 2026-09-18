const API_URL = `${import.meta.env.VITE_API_URL}/api`;


const getToken = () => {
    return localStorage.getItem("token");
};


/* =========================
   GET LOST ITEMS
========================= */

export const getLostItems = async () => {
    try {

        const response =
            await fetch(`${API_URL}/lost`);

        return await response.json();

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "Unable to fetch lost items"
        };

    }
};


/* =========================
   GET FOUND ITEMS
========================= */

export const getFoundItems = async () => {
    try {

        const response =
            await fetch(`${API_URL}/found`);

        return await response.json();

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "Unable to fetch found items"
        };

    }
};


/* =========================
   GET ALL ITEMS
========================= */

export const getAllItems = async () => {
    try {

        const [
            lostResponse,
            foundResponse
        ] = await Promise.all([

            getLostItems(),
            getFoundItems()

        ]);


        const lostItems =
            lostResponse.success

                ? (
                    lostResponse.lostItems || []
                ).map(item => ({

                    ...item,
                    type: "lost"

                }))

                : [];


        const foundItems =
            foundResponse.success

                ? (
                    foundResponse.foundItems || []
                ).map(item => ({

                    ...item,
                    type: "found"

                }))

                : [];


        const allItems = [

            ...lostItems,
            ...foundItems

        ].sort((a, b) => {

            return (
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );

        });


        return {

            success: true,
            items: allItems

        };

    } catch (error) {

        console.error(error);

        return {

            success: false,
            message: "Unable to fetch items"

        };

    }
};


/* =========================
   UPDATE LOST ITEM
========================= */

export const updateLostItem = async (
    itemId,
    formData
) => {

    try {

        const token = getToken();


        const response = await fetch(

            `${API_URL}/lost/${itemId}`,

            {
                method: "PUT",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                },

                body: formData
            }

        );


        return await response.json();

    } catch (error) {

        console.error(error);

        return {

            success: false,
            message:
                "Unable to update lost item"

        };

    }

};


/* =========================
   UPDATE FOUND ITEM
========================= */

export const updateFoundItem = async (
    itemId,
    formData
) => {

    try {

        const token = getToken();


        const response = await fetch(

            `${API_URL}/found/${itemId}`,

            {
                method: "PUT",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                },

                body: formData
            }

        );


        return await response.json();

    } catch (error) {

        console.error(error);

        return {

            success: false,
            message:
                "Unable to update found item"

        };

    }

};


/* =========================
   DELETE LOST ITEM
========================= */

export const deleteLostItem = async (
    itemId
) => {

    try {

        const token = getToken();


        const response = await fetch(

            `${API_URL}/lost/${itemId}`,

            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }

        );


        return await response.json();

    } catch (error) {

        console.error(error);

        return {

            success: false,
            message:
                "Unable to delete lost item"

        };

    }

};


/* =========================
   DELETE FOUND ITEM
========================= */

export const deleteFoundItem = async (
    itemId
) => {

    try {

        const token = getToken();


        const response = await fetch(

            `${API_URL}/found/${itemId}`,

            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }

        );


        return await response.json();

    } catch (error) {

        console.error(error);

        return {

            success: false,
            message:
                "Unable to delete found item"

        };

    }

};