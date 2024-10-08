import { ROUTE_LOGIN, ROUTE_REGISTER } from "../dist/api";
import { POST, getBody } from "."; // Make sure to import getBody

const handleRequest = (route, formData, callback) => {
    POST(route, formData)
        .then(response => {
            const data = getBody(response); // Access the parsed response body
            if (data.success) {
                callback(null, data); // Success: pass data to the callback
            } else {
                callback(new Error(data.message || "An error occurred"), null); // Error response from API
            }
        })
        .catch(err => {
            callback(err, null); // Handle network or parsing errors
        });
};


export const REQUEST_LOGIN = (formData, callback) => {
    return handleRequest(ROUTE_LOGIN, formData, callback);
};

export const REQUEST_REGISTER = (formData, callback) => {
    return handleRequest(ROUTE_REGISTER, formData, callback);
};


