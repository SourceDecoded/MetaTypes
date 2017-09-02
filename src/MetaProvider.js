import Visitor from "./Visitor";
import EntityBuilder from "./EntityBuilder";

export default class MetaProvider {
    constructor(options = {}) {
        this.sqliteProvider = options.sqliteProvider;
        this.decorators = options.decorators;
    }

    toArrayAsync(queryable) {
       
    }

    toArrayWithCountAsync(queryable) {
        
    }

    countAsync() {
        
    }
}