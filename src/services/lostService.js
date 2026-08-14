const BASE_URL = "http://localhost:5000/api/lost";

export const reportLostItem = async (itemData) => {
    try {

        const response = await fetch(`${BASE_URL}/report`, {
            method: "POST",
            body: itemData
        });

        return await response.json();

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "Unable to connect to server"
        };

    }
};

export const getLostItems = async () => {
    try {

        const response = await fetch(`${BASE_URL}`);

        return await response.json();

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: "Unable to fetch lost items"
        };

    }
};