import TableStatementBuilder from "./TableStatementBuilder";

export default class Migrator {
    constructor(edmPoolPromise) {
        this._edmPoolPromise = edmPoolPromise;
        this._tableStatementBuilder = new TableStatementBuilder();
    }

    _executeAsync(query) {
        this._edmPoolPromise.then((pool) => {
            return pool.query(query);
        });
    }

    addColumnAsync(edm, options = {}) {
        let query = `ALTER TABLE `;

        return this._executeAsync(query);
    }

    addDecoratorAsync(edm, options = {}) {
    }

    addTableAsync(edm, options = {}) {
    }

    removeColumnAsync(edm, options = {}) {
    }

    removeDecoratorAsync(edm, options = {}) {
    }

    removeTableAsync(edm, options = {}) {
    }

    updateColumnAsync(edm, options = {}) {
    }

    updateDecoratorAsync(edm, options = {}) {
    }

    updateTableAsync(edm, options = {}) {
    }
}
