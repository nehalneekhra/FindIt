const BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

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

export const googleLoginUser = async (idToken) => {
    try {
        const response = await fetch(`${BASE_URL}/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
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