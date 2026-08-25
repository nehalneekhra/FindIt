const BASE_URL = "http://localhost:5001/api/found";

export const reportFoundItem = async (formData) => {
    try {

        const response = await fetch(`${BASE_URL}/report`, {
            method: "POST",
            body: formData
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