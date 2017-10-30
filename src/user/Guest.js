import User from "./User";

export default class Guest extends User {
    constructor() {
        super();
        this.id = "guest"
        this.name = "Guest";
        this.isAdmin = false;
    }
}