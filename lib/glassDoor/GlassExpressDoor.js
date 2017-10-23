"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // GlassExpress
// Implements GlassDoor to expose a GlassDb by HTTP


var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _GlassExpressDataRouter = require("./GlassExpressDataRouter");

var _GlassExpressDataRouter2 = _interopRequireDefault(_GlassExpressDataRouter);

var _GlassExpressEDMApp = require("./GlassExpressEDMApp");

var _GlassExpressEDMApp2 = _interopRequireDefault(_GlassExpressEDMApp);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(options) {
        var _this = this;

        _classCallCheck(this, _class);

        this.port = options.port || "8888";
        this.address = options.address || "127.0.0.1";
        this.apiRoot = options.apiRoot || "/api";
        this.edmRoot = options.edmRoot || "/edm";
        this.glass = options.glass;
        this.panes = {};
        this.entityRouters = {};
        this.edmRouters = {};

        this.mainApp = (0, _express2.default)();
        this.dataApp = (0, _express2.default)();
        this.edmApp = (0, _express2.default)();
        this.edmApp.use(_bodyParser2.default.json());

        this._nativeHTTPServer = this.mainApp.listen(this.port, this.address, function (err) {
            if (!err) {
                _this.mainApp.use(_this.apiRoot, _this.dataApp);
                _this.mainApp.use(_this.edmRoot, _this.edmApp);
                console.log("ExpressDoor is listening on " + _this.port + ":" + _this.address + " ");
                console.log("Data API mounted at " + _this.apiRoot);
                console.log("EDM API mounted at " + _this.edmRoot);
                _this._init();
            } else {
                throw err;
            }
        });
    }

    _createClass(_class, [{
        key: "dispose",
        value: function dispose() {
            if (this._nativeHTTPServer) {
                this._nativeHTTPServer.close();
                this._nativeHTTPServer = null;
            }
        }
    }, {
        key: "addPane",
        value: function addPane(pane) {
            var router = new _GlassExpressDataRouter2.default(this.dataApp, pane);
            this.entityRouters[edm.name + edm.version] = router;
            router.attach();

            var edmRouter = new GlassExpressEdmRouter(this.edmApp, pane);
            this.edmRouters[edm.name + edm.version] = edmRouter;
            edmRouter.attach();

            this.panes[pane.edm.name + pane.edm.version] = pane;
        }
    }, {
        key: "removePane",
        value: function removePane(pane) {
            var _pane$edm = pane.edm,
                name = _pane$edm.name,
                version = _pane$edm.version;

            var myPane = this.panes[name + version];
            var edmRouter = this.edmRouters[name + version];
            var entityRouter = this.entityRouters[name + version];

            edmRouter.dispose();
            entityRouter.dispose();

            this.panes[name + version] = null;
            this.edmRouters[name + version] = null;
            this.entityRouters[name + version] = null;
        }
    }, {
        key: "_init",
        value: function _init() {
            var _this2 = this;

            // Set up Express handlers for dealing with EDMs
            // add a new EDM
            this.edmApp.post("/", function (req, res, next) {
                var _req$body = req.body,
                    name = _req$body.name,
                    version = _req$body.version;

                if (!name || !version) {
                    res.status(500).send("Name and version required");
                }
                _this2.glass.getEdmAsync(name, version).then(function (edm) {
                    if (edm) {
                        res.status(500).send("EDM with that name and version already exists");
                    } else {
                        _this2.glass.addEdmAsync(name, version).then(function () {
                            res.status(200).end();
                        });
                    }
                });
            });

            // get an EDM
            this.edmApp.get("/:name/:version", function (req, res, next) {
                var _req$params = req.params,
                    name = _req$params.name,
                    version = _req$params.version;

                _this2.glass.getEdmAsync(name, version).then(function (edm) {
                    res.type("json").send(edm.json);
                });
            });

            // Let's not implement delete yet, we will need to have some
            // kind of premission set up around all this at some point
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=GlassExpressDoor.js.map