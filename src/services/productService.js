const API_URL = "https://my-shop-api-p7kz.onrender.com/api/products";

export const getProducts = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const getProductById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
};