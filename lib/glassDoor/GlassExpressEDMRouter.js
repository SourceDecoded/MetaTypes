"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// listen to

var _class = function () {
    function _class(app, pane) {
        _classCallCheck(this, _class);

        this.app = app;
        this.pane = pane;
        this.enabled = true;
    }

    _createClass(_class, [{
        key: "dispose",
        value: function dispose() {
            this.enabled = false;
        }
    }, {
        key: "attach",
        value: function attach() {
            var _this = this;

            var handler = _express2.default.Router();

            handler.use(function (req, res, next) {
                if (_this.enabled) {
                    next();
                } else {
                    res.status(500).send("This API is no longer valid");
                }
            });
            handler.use(_bodyParser2.default.json());

            handler.post("/:name/:version", function (req, res, next) {
                var _req$params = req.params,
                    name = _req$params.name,
                    version = _req$params.version;
                // get the commands
            });

            this.app.use("/" + this.pane.edm.name + "/" + this.pane.edm.version, handler);
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=GlassExpressEDMRouter.js.map