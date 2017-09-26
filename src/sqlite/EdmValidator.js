import dataTypeMapping from "./dataTypeMapping";
import EdmValidator from "./../EdmValidator";

export default class extends EdmValidator {
    constructor() {
        super(dataTypeMapping);
    }
}