import Visitor from "./Visitor";

export default class Provider {
    constructor(type, sqlite) {
        this.sqlite = sqlite;
    }

    executeAsync(queryable) {
        let query = queryable;
        
    }
}