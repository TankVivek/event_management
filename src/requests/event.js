// src/requests/event.js
import Authentication from '../helpers/auth'; // Import the Authentication class
import { EVENT_CREATE, EVENT_LISTING, EVENT_UPDATE ,EVENT_BOOKING ,EVENT_BOOKING_GET,EVENT_BOOKING_CANCEL} from "../dist/api";
import { POST, GET, PUT } from "."; // Import PUT here

const authHeader = () => {
    const token = (new Authentication()).getApiKey();
    return { 'Authorization': `Bearer ${token}` };
};

export const REQUEST_EVENT_CREATE = (formData, callback) => {
    return POST(EVENT_CREATE, formData).set(authHeader()).end(callback);
};

export const REQUEST_EVENT_UPDATE = (id, formData, callback) => {
    return PUT(`${EVENT_UPDATE}/${id}`, formData).set(authHeader()).end(callback);
};

export const REQUEST_EVENT_GET = (callback) => {
    return GET(EVENT_LISTING).set(authHeader()).end(callback);
};

export const REQUEST_BOOKING = (eventId, members, callback) => {
    return POST(EVENT_BOOKING.replace(':eventId', eventId).replace(':members', members))
        .set(authHeader())
        .end(callback);
};

export const REQUEST_USER_BOOKING = (id, callback) => {
    return GET(EVENT_BOOKING_GET.replace(':id', id)).set(authHeader()).end(callback);
};

export const REQUEST_CNACEL_BOOKING = (bookingId, callback) => {
    return PUT(EVENT_BOOKING_CANCEL.replace(':bookingId', bookingId)).set(authHeader()).end(callback);
};