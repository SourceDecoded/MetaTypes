"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EdmContext = function () {
    function EdmContext() {
        var edm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var history = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, EdmContext);

        this.edm = edm;
        this.history = history;
    }

    _createClass(EdmContext, [{
        key: "addTable",
        value: function addTable() {}
    }, {
        key: "removeTable",
        value: function removeTable() {}
    }, {
        key: "updateTable",
        value: function updateTable() {}
    }]);

    return EdmContext;
}();

exports.default = EdmContext;
//# sourceMappingURL=EdmHistory.js.map