"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // GlassExpress
// Implements GlassDoor to expose a GlassDb by HTTP


var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _GlassExpressRouter = require("./GlassExpressRouter");

var _GlassExpressRouter2 = _interopRequireDefault(_GlassExpressRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.port = options.port || "8888";
        this.address = options.address || "127.0.0.1";
        this.apiRoot = options.apiRoot || "/api";
        this.edmRoot = options.edmRoot || "/edm";
        this.glass = options.glass;
        this.panes = this.glass.panes;
        this.entityRouters = {};

        this.app = (0, _express2.default)();

        _init();
    }

    _createClass(_class, [{
        key: "_init",
        value: function _init() {
            var _this = this;

            this.panes.forEach(function (pane) {
                var router = new _GlassExpressRouter2.default(_this.app, pane);
                _this.entityRouters[edm.name] = router;
                router.attach(_this.apiRoot);
            });

            // TODO: build the /edm endpoint once we know how it should work
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=ExpressDoor.js.map