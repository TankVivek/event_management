export default class Authentication {
    setApiKey(apiKey, user) {
        console.log(apiKey, user);
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('user', user);
    }
    setUserRole(role) {
        localStorage.setItem('role', role);
    }
    setUserId(_id) {
        localStorage.setItem('id', _id);
    }  
    getApiKey() {
        return localStorage.getItem('apiKey');
    }

    getUser() {
        return localStorage.getItem('user');
    }

    isUserLoggedIn() {
        return this.getApiKey() !== null;
    }

    removeApiKey() {
        console.log("removing");
        localStorage.removeItem('apiKey');
        localStorage.removeItem('user');
    }
}
