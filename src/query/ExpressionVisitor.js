import { Expression } from "./Expression";

export default class ExpressionVisitor {

    parse(expression) {
        let children = [];

        if (!expression) {
            return null;
        }

        expression.children.forEach((expression) => {
            if (!expression.children) {
                children.push(expression);
            } else {
                children.push(this.parse(expression));
            }
        });

        let func = this[expression.nodeName];

        if (!func) {
            throw new Error("The builder doesn't support the \"" + expression.nodeName + "\" expression.");
        }

        children.forEach((child, index) => {
            if (child instanceof Expression) {
                var func = this[child.nodeName];
                if (!func) {
                    throw new Error("The builder doesn't support the \"" + child.nodeName + "\" expression.");
                }
                children[index] = func.call(this, child);
            }
        });

        return func.apply(this, children);
    }

}
