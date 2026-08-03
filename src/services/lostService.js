const BASE_URL = "http://localhost:5000/api/lost";

export const reportLostItem = async (itemData) => {
  try {
    const response = await fetch(`${BASE_URL}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });

    return await response.json();
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to connect to server",
    };
  }
};