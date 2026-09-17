const API_URL = "http://localhost:5001/api/users";


const getToken = () => {
    return localStorage.getItem("token");
};


const authHeaders = () => {
    return {
        Authorization: `Bearer ${getToken()}`
    };
};


// ===============================
// UPDATE PROFILE
// ===============================
export const updateProfile = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "PUT",
            headers: authHeaders(),
            body: formData
        });

        return await response.json();

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unable to update profile"
        };
    }
};


// ===============================
// CHANGE PASSWORD
// ===============================
export const changePassword = async (
    currentPassword,
    newPassword
) => {
    try {
        const response = await fetch(`${API_URL}/password`, {
            method: "PUT",
            headers: {
                ...authHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });

        return await response.json();

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unable to change password"
        };
    }
};