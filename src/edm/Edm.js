export default class Edm {
    constructor(name, label, version) {
        this.name = null;
        this.label = null;
        this.version = null;
        this.tables = [];
        this.relationships = {
            oneToOne: [],
            oneToMany: []
        };
    }
}