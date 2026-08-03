const BASE_URL = "http://localhost:5000/api/auth";

export const signupUser = async (userData) => {
    try {

        const response = await fetch(`${BASE_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        return data;

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unable to connect to server"
        };
    }
};

export const loginUser = async (userData) => {
    try {

        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
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