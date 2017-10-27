// GlassPane
// Represent an EDM, manage its corresponding DB and Migrator
import Edm from "../edm/Edm";
import Migrator from "../edm/Migrator";

export default class {
    constructor(options) {
        this.edm = options.edm;
        this.metaDatabase = options.metaDatabase;
        this.migrationRunner = options.migrationRunner;
    }

    dispose() {
        // nothing to see here now, but stay tuned!
    }
    
    // I can't quite remember what the GlassPane is supposed to do, but it is 
    // currently very good at holding
    // on to an EDM and its related things.
}