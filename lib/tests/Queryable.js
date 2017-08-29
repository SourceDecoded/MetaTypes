"use strict";

var _assert = require("assert");

var assert = _interopRequireWildcard(_assert);

var _Queryable = require("./../query/Queryable");

var _Queryable2 = _interopRequireDefault(_Queryable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports["Queryable: Constructor."] = function () {
    var queryable = new _Queryable2.default();
    assert.ok(true);
};

exports["Queryable: Constructor with query."] = function () {
    var queryable = new _Queryable2.default();
    queryable = queryable.where(function (expBuilder) {
        return expBuilder.property("firstName").isEqualTo("Jared");
    });

    var query = queryable.getQuery();

    assert.equal("equalTo", query.where.children[0].nodeName);
    assert.equal("firstName", query.where.children[0].children[0].children[1].value);
    assert.equal("Jared", query.where.children[0].children[1].value);
};
//# sourceMappingURL=Queryable.js.map