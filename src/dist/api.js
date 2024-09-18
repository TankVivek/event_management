/*global API_PREFIX*/

let addPrefix = (route) =>  {
    return API_PREFIX+'/'+route;
};


export const ROUTE_REGISTER = addPrefix('api/register');
export const ROUTE_LOGIN = addPrefix('api/login');


export const EVENT_CREATE = addPrefix('api/create-events');
export const EVENT_UPDATE = addPrefix('api/update-events');
export const EVENT_LISTING = addPrefix('api/list-events');
export const EVENT_BOOKING = addPrefix('api/events/:eventId/book/:members');
export const EVENT_BOOKING_GET = addPrefix('api/bookings/:id');
export const EVENT_BOOKING_CANCEL =  addPrefix('api/bookings/:bookingId/cancel')
export const EVENT_DELETE = addPrefix('api/events/:id')
