const BASE_URL = `${import.meta.env.VITE_API_URL}/api/found`;

const getToken = () => {
    return localStorage.getItem("token");
};

export const reportFoundItem = async (formData) => {
    try {
        const token = getToken();

        const response = await fetch(`${BASE_URL}/report`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
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