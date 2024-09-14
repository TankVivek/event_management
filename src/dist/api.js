/*global API_PREFIX*/

let addPrefix = (route) =>  {
    return API_PREFIX+'/'+route;
};


export const ROUTE_REGISTER = addPrefix('api/register');
export const ROUTE_LOGIN = addPrefix('api/login');


export const EVENT_CREATE = addPrefix('api/create');
export const EVENT_LISTING = addPrefix('api/get');
export const EVENT_DETAILS = addPrefix('api/get/:id');