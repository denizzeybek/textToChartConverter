import axios from "axios";

const instance = axios.create({
    baseURL: "https://localhost:44389/api", // TODO: read from ENV
    headers: {
        "Content-Type": "application/json",
    },
});

export default instance;
