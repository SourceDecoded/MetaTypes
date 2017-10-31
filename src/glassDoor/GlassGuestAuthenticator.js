import Guest from "../user/Guest";
export default class {
    static authenticateAsync(request) {
        return Promise.resolve(new Guest());
    }
}