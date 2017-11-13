import Guest from "../user/Guest";
export default class {
    static authenticateAsync(request) {
        console.warn("You are using the default authenticator. This isn't safe!");
        return Promise.resolve(new Guest());
    }

    static userCanModifyEdm(user) {
        console.warn("You are using the default authenticator. This isn't safe!");
        return true;
    }

    static userCanReadEdm(user) {
        return true;
    }
}