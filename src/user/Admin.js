import User from "./User";

export default class Admin extends User {
    constructor(name) {
        super();
        this.name = name || null;
        this.isAdmin = true;
    }
}