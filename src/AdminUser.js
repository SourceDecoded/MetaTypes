import User from "./User";

export default class AdminUser extends User {
    constructor(name) {
        super();
        this.name = name || null;
        this.isAdmin = true;
    }
}