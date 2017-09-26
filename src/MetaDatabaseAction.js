import Guid from "./Guid";

export default class MetaDatabaseAction {
    constructor(id) {
        this.id = id || Guid.create();

        this.execute = {
            action: null,
            options: null
        };

        this.revert = {
            action: null,
            options: null
        };
    }
}