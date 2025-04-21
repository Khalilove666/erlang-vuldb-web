import axios from "axios";

export const vulDbClient = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    validateStatus: function (status) {
        return status >= 200 && status < 300; // Only 2xx is successful
    },
});

export interface VulDbResponse<Data> {
    status: number,
    message: string,
    data: Data 
}