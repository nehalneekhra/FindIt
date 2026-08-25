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


export const getAllItems = async () => {

    try {

        const [lostResponse, foundResponse] =
            await Promise.all([
                getLostItems(),
                getFoundItems()
            ]);


        const lostItems =
            lostResponse.success
                ? (lostResponse.lostItems || []).map(item => ({
                    ...item,
                    type: "lost"
                }))
                : [];


        const foundItems =
            foundResponse.success
                ? (foundResponse.foundItems || []).map(item => ({
                    ...item,
                    type: "found"
                }))
                : [];


        const allItems = [
            ...lostItems,
            ...foundItems
        ].sort((a, b) => {

            return new Date(b.createdAt) -
                   new Date(a.createdAt);

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