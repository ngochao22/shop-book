import axios from "../utils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
    return axios.post("/api/v1/user/register", {
        fullName,
        email,
        password,
        phone,
    });
};

export const callLogin = (username, password) => {
    return axios.post("/api/v1/auth/login", { username, password });
};

export const callFetchAccount = () => {
    return axios.get("/api/v1/auth/account");
};

export const callLogout = () => {
    return axios.post("/api/v1/auth/logout");
};

export const callGetListUser = (query) => {
    return axios.get(`/api/v1/user?${query}`);
};

export const callCreateUser = (fullName, email, phone, password) => {
    return axios.post("/api/v1/user", { fullName, email, password, phone });
};

export const callUpdateUser = (_id, fullName, phone) => {
    return axios.put("/api/v1/user", { _id, fullName, phone });
};

export const callDeleteUser = (_id) => {
    return axios.delete(`/api/v1/user/${_id}`);
};

export const callGetListBook = (query) => {
    return axios.get(`/api/v1/book?${query}`);
};

export const callFetchCategory = () => {
    return axios.get("/api/v1/database/category");
};

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append("fileImg", fileImg);
    return axios({
        method: "post",
        url: "/api/v1/file/upload",
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book",
        },
    });
};

export const callCreateBook = (
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
    thumbnail,
    slider
) => {
    return axios.post("/api/v1/book", {
        mainText,
        author,
        price,
        sold,
        quantity,
        category,
        thumbnail,
        slider,
    });
};

export const callDeleteBook = (id) => {
    return axios.delete(`/api/v1/book/${id}`);
};

export const callUpdateBook = (
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
    thumbnail,
    slider,
    id
) => {
    return axios.put(`/api/v1/book/${id}`, {
        mainText,
        author,
        price,
        sold,
        quantity,
        category,
        thumbnail,
        slider,
    });
};

export const callGetBookDetail = (id) => {
    return axios.get(`/api/v1/book/${id}`);
};

export const callPlaceOrder = (data) => {
    return axios.post("/api/v1/order", { ...data });
};

export const callHistoryOrder = () => {
    return axios.get("/api/v1/history");
};

export const callDashboard = () => {
    return axios.get("/api/v1/database/dashboard");
};

export const callGetListOrder = (query) => {
    return axios.get(`/api/v1/order?${query}`);
};
