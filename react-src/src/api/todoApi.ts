import axios from 'axios';
import { toast } from 'react-toastify';

let browserCurrentUrl = window.location.href;
browserCurrentUrl = browserCurrentUrl.split("/")[2];

let host = browserCurrentUrl.split(":")[0];
// let port: number = parseInt(browserCurrentUrl.split(":")[1]);

const port = 3000;

let apiUrl = `http://${host}:${port}`
console.log(host, apiUrl)

export let url = apiUrl;

// axios
let api = axios.create({
    baseURL: url
});

// GET REQUEST Helper
const get = async (endpointUrl: String, params?: Object) => {

    if (!params) {
        params = {};
    }

    try {
        const response = await api.get(`${url}${endpointUrl}`, { params: params });
        return response.data;
    }
    catch (error) {
        console.log(error);
    }

    return null;
}

// POST REQUEST Helper
const post = async (endpointUrl: String, bodyData: Object, successMsg: any, callback: CallableFunction) => {
    api.post(`${url}${endpointUrl}`, bodyData)
        .then((response) => {
            if (response.data["errorMsg"]) {
                toast.error(response.data["errorMsg"])
            }
            else {
                // not null
                if (successMsg) {
                    toast.info(successMsg);
                }
            }

            if (callback) {
                callback();
            }
        }, (error) => {
            console.log(error);
        });
}

// ---------- api ---------- //

// get config data
export const getSomeData = async () => {
    return await get("/api/notes/fetch");
}

// post config update
export const postCreateNote = (name: String, callback: CallableFunction) => {
    let body = {
        name: name,
    };

    post("/api/notes/create", body, null, callback);
}

export default api;