import Table from "./Table";

export default class Database {
    constructor(sqlite, edm) {
        if (sqlite == null) {
            throw new Error("Database needs to have a sqlite.");
        }
        if (edm == null) {
            throw new Error("Database needs to have a edm.");
        }

        this.name = edm.name;
        this.sqlite = sqlite;
    }

    _createTableAsync(type) {

    }

    _getTableAsync(type) {

    }

    activateAsync() {

    }

    addEntityAsync() {

    }

    deactivateAsync() {

    }

    getQueryableAsync(type) {

    }

    getQueryProviderAsync(type) {

    }

    removeEntityAsync() {

    }

    updateEntityAsync() {

    }
}