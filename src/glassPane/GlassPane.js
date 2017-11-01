// GlassPane
// Represent an EDM, manage its corresponding DB and Migrator
import Edm from "../edm/Edm";
import Migrator from "../edm/Migrator";

export default class {
    constructor(options) {
        this.edm = options.edm;
        this.metaDatabase = options.metaDatabase;
        this.migrationRunner = options.migrationRunner;
        this.actions = options.actions;
    }

    dispose() {
        // nothing to see here now, but one never knows!
    }
    
    executeEdmActionAsync(actionName, options) {
        let action = this.actions.edm[actionName];
        if (!action) {
            return Promise.reject("EDM action not found: " + actionName);
        }
        options.metaDatabase = this.metaDatabase;
        return action.executeAsync(options);
    }

    executeTableActionAsync(tableName, actionName, options) {
        let action = this.actions.table[tableName][actionName];
        if (!action) {
            return Promise.reject("Table action not found: " + actionName);
        }
        options.metaDatabase = this.metaDatabase;
        options.tableName = tableName;
        return action.executeAsync(options);
    }

    executeEntityActionAsync(tableName, actionName, options) {
        let action = this.actions.entity[tableName][actionName];
        if (!action) {
            return Promise.reject("Entity action not found: " + actionName);
        }
        options.metaDatabase = this.metaDatabase;
        options.tableName = tableName;
        return action.executeAsync(options);
    }
}