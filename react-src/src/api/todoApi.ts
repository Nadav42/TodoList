import axios from 'axios';
import { toast } from 'react-toastify';

import { INote, ITodoItem } from './interfaces'

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
                callback(response.data);
            }
        }, (error) => {
            console.log(error);
        });
}

// PATCH REQUEST Helper
const patch = async (endpointUrl: String, bodyData: Object, successMsg: any, callback: CallableFunction) => {
    api.patch(`${url}${endpointUrl}`, bodyData)
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
                callback(response.data);
            }
        }, (error) => {
            console.log(error);
        });
}

// DELETE REQUEST Helper
const httpDelete = async (endpointUrl: String) => {
    try {
        const response = await api.delete(`${url}${endpointUrl}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }

    return null;
}

// ---------- api ---------- //

// get all notes data
export const getNotesData = async (): Promise<{ results: [INote] }> => {
    return await get("/api/notes/fetch");
}

// get single note by id
export const getNoteById = async (noteId: string): Promise<INote> => {
    return await get(`/api/notes/${noteId}`);
}

// post create note
export const postCreateNote = (name: String, callback: CallableFunction) => {
    let body = {
        name: name,
    };

    post("/api/notes/create", body, null, callback);
}

// patch modify note (name)
export const patchModifyNote = (noteId: string, name: string, callback: CallableFunction) => {
    let body = {
        name: name,
    };

    patch(`/api/notes/${noteId}`, body, null, callback);
}

// remove todo list
export const deleteNote = async (todoId: string): Promise<INote> => {
    return await httpDelete(`/api/notes/${todoId}`);
}

// items

// post create todo item
export const postCreateTodoItem = (noteId: string, name: String, callback: CallableFunction) => {
    let body = {
        noteId: noteId,
        itemName: name
    };

    post("/api/items/add", body, null, callback);
}

// patch modify item
export const patchModifyItem = (noteId: string, itemId: string, name: string, checked: boolean, callback: CallableFunction) => {
    let body = {
        name: name,
        checked: checked
    };

    patch(`/api/items/${noteId}/${itemId}`, body, null, callback);
}

// remove todo item
export const deleteTodoItem = async (noteId: string, todoId: string): Promise<INote> => {
    return await httpDelete(`/api/items/${noteId}/${todoId}`);
}


export default api;