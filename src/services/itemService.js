const API_URL = "http://localhost:5001/api";

export const getLostItems = async () => {
    try {
        const response = await fetch(`${API_URL}/lost`);
        return await response.json();
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unable to fetch lost items"
        };
    }
};

export const getFoundItems = async () => {
    try {
        const response = await fetch(`${API_URL}/found`);
        return await response.json();
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unable to fetch found items"
        };
    }
};