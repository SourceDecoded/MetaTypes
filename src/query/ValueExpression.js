import Expression from "./Expression";

export default class ValueExpression extends Expression {
    constructor(nodeName, value) {
        super();
        this.value = value;
        this.nodeName = nodeName;
    }

    copy() {
        return new ValueExpression(this.nodeName, this.value);
    }

    isEqualTo(node) {
        if (node && this.nodeName === node.nodeName && this.value === node.value) {
            return true;
        }
        return false;
    }

    contains(node) {
        return this.isEqualTo(node);
    }
}
