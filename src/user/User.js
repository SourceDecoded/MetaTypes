export default class User {
    constructor() {
        this.id = null;
        this.authenticatedId = null;
        this.name = null;
        this.isAdmin = false;
        this.groups = [];
    }
}