import Guid from "./../util/Guid";

export default class Command {
    constructor(id) {
        this.id = id || Guid.create();

        this.execute = {
            action: null,
            options: null,
            response: null
        };

        this.revert = {
            action: null,
            options: null,
            response: null
        };
    }
}