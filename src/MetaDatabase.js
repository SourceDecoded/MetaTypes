export default class MetaDatabase {

    constructor(options = {}) {
        this.sqlite = options.sqlite;
        this.edm = options.edm;
        this.tables = [];
    }

    getTable(name){

    }

}