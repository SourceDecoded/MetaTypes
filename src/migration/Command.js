import Guid from "./../util/Guid";

export default class Command {
    constructor(id) {
        this.id = id || Guid.create();

        this.execute = {
            command: null,
            options: null,
            response: null
        };

        this.revert = {
            command: null,
            options: null,
            response: null
        };
    }
}