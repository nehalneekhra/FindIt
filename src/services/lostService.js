const BASE_URL = `${import.meta.env.VITE_API_URL}/api/lost`;

const getToken = () => {
    return localStorage.getItem("token");
};

export const reportLostItem = async (itemData) => {
    try {
        const token = getToken();

        const response = await fetch(`${BASE_URL}/report`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
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