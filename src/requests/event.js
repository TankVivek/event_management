// src/requests/event.js
import Authentication from '../helpers/auth'; // Import the Authentication class
import { EVENT_CREATE, EVENT_LISTING, EVENT_UPDATE } from "../dist/api";
import { POST, GET, PUT } from "."; // Import PUT here

const authHeader = () => {
    const token = (new Authentication()).getApiKey();
    return { 'Authorization': `Bearer ${token}` };
};

export const REQUEST_EVENT_CREATE = (formData, callback) => {
    return POST(EVENT_CREATE, formData).set(authHeader()).end(callback);
};

export const REQUEST_EVENT_GET = (callback) => {
    return GET(EVENT_LISTING).set(authHeader()).end(callback);
};

export const REQUEST_EVENT_UPDATE = (id, formData, callback) => {
    return PUT(`${EVENT_UPDATE}/${id}`, formData).set(authHeader()).end(callback);
};
