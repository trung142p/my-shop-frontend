import axios from 'axios';

const api = axios.create({
    // Dán chính xác link Render của bạn vào đây, nhớ thêm /api ở cuối
    baseURL: "https://my-shop-api-p7kz.onrender.com/api"
});

export default api;