import Expression from "./Expression";

export default class OperationExpression extends Expression {
    constructor(nodeName) {
        super();
        var args = Array.prototype.slice.call(arguments, 0);

        this.nodeName = nodeName;
        this.children = args.slice(1);
    }
    copy() {
        var children = [];
        var copy = new OperationExpression(this.nodeName);

        this.children.forEach(expression => {
            copy.children.push(expression.copy());
        });

        return copy;
    }

    isEqualTo() {
        if (!Array.isArray(node.children) || this.nodeName !== node.nodeName) {
            return false;
        }

        if (node.children.length !== this.children.length) {
            return false;
        }

        return this.children.every((expression, index) => {
            return expression.isEqualTo(node.children[index]);
        });
    }

    contains(node) {
        if (node.nodeName === this.nodeName && Array.isArray(node.children)) {
            var matched = node.children.every((childNode, index) => {
                return childNode.contains(this.children[index]);
            });

            if (matched) {
                return true;
            }
        }

        return this.children.some(childNode => {
            return childNode.contains(node);
        });
    }

    getMatchingNodes(node, matchedNodes) {
        matchedNodes = Array.isArray(matchedNodes) ? matchedNodes : [];

        if (node.nodeName === this.nodeName && Array.isArray(node.children)) {
            var matched = node.children.every((childNode, index) => {
                return childNode.contains(this.children[index], matchedNodes);
            });

            if (matched) {
                matchedNodes.push(this);
            }
        }

        this.children.forEach(childNode => {
            if (Array.isArray(childNode.children)) {
                childNode.getMatchingNodes(node, matchedNodes);
            }
        }, matchedNodes);

        return matchedNodes;
    }
}
