"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // GlassExpress
// Implements GlassDoor to expose a GlassApi by HTTP


var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _GlassExpressDataRouter = require("./GlassExpressDataRouter");

var _GlassExpressDataRouter2 = _interopRequireDefault(_GlassExpressDataRouter);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _GlassGuestAuthenticator = require("./GlassGuestAuthenticator");

var _GlassGuestAuthenticator2 = _interopRequireDefault(_GlassGuestAuthenticator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(options) {
        var _this = this;

        _classCallCheck(this, _class);

        this.port = options.port || "8888";
        this.address = options.address || "127.0.0.1";
        this.apiRoot = options.apiRoot || "/data";
        this.edmRoot = options.edmRoot || "/edm";
        this.glass = options.glass;
        this.panes = {};
        this.entityRouters = {};
        this.mainApp = (0, _express2.default)();
        this.dataApp = (0, _express2.default)();
        this.edmApp = (0, _express2.default)();
        this.edmApp.use(_bodyParser2.default.json());
        this.authenticator = this.glass.authenticator || _GlassGuestAuthenticator2.default;

        this._nativeHTTPServer = this.mainApp.listen(this.port, this.address, function (err) {
            if (!err) {
                _this.mainApp.use(_this.apiRoot, _this.dataApp);
                _this.mainApp.use(_this.edmRoot, _this.edmApp);
                console.log("ExpressDoor is listening on " + _this.address + ":" + _this.port + " ");
                console.log("Data API mounted at " + _this.apiRoot);
                console.log("EDM API mounted at " + _this.edmRoot);

                _this.mainApp.get('/@\*', function (req, res, next) {
                    var options = {
                        query: req.query.q
                    };
                    var actionName = req.params[0];
                    _this.glass.executeApiActionAsync(actionName, options).then(function (result) {
                        res.send(result);
                    }).catch(function (error) {
                        res.status(404).send({ error: error.message });
                    });
                });

                _this.mainApp.post('/@\*', function (req, res, next) {
                    var options = {
                        query: req.query.q,
                        body: req.body
                    };
                    var actionName = req.params[0];
                    _this.glass.executeApiActionAsync(actionName, options).then(function (result) {
                        res.send(result);
                    }).catch(function (error) {
                        res.status(404).send({ error: error.message });
                    });
                });

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
            var _pane$edm = pane.edm,
                name = _pane$edm.name,
                version = _pane$edm.version;

            var router = new _GlassExpressDataRouter2.default(this.dataApp, pane, this.authenticator);
            this.entityRouters[name + version] = router;
            router.attach();

            this.panes[name + version] = pane;
        }
    }, {
        key: "removePane",
        value: function removePane(pane) {
            var _pane$edm2 = pane.edm,
                name = _pane$edm2.name,
                version = _pane$edm2.version;

            var myPane = this.panes[name + version];
            var entityRouter = this.entityRouters[name + version];

            entityRouter.dispose();

            this.panes[name + version] = null;
            this.entityRouters[name + version] = null;
        }
    }, {
        key: "_init",
        value: function _init() {
            var _this2 = this;

            this.edmApp.use(function (req, res, next) {
                if (!(req.method === "OPTIONS")) {
                    _this2.authenticator.authenticateAsync(req).then(function (user) {
                        req.user = user;
                        next();
                    }).catch(function (error) {
                        next();
                    });
                } else {
                    next();
                }
            });

            this.edmApp.use(function (req, res, next) {
                if (req.method === "GET") {
                    if (_this2.authenticator.userCanReadEdm(req.user)) {
                        next();
                    } else {
                        res.status(403).send("User unauthorized to read EDM");
                    }
                } else if (req.method === "POST") {
                    if (_this2.authenticator.userCanModifyEdm(req.user)) {
                        next();
                    } else {
                        res.status(403).send("User unauthorized to modify EDM");
                    }
                }
            });

            // Set up Express handlers for dealing with EDMs
            // add a new EDM
            this.edmApp.post("/", function (req, res, next) {
                var _req$body = req.body,
                    name = _req$body.name,
                    version = _req$body.version,
                    label = _req$body.label;

                label = label || name;
                if (!name || !version) {
                    res.status(500).send("Name and version required");
                } else {
                    _this2.glass.getEdmAsync(name, version).then(function (edm) {
                        if (edm) {
                            res.status(500).send("EDM with that name and version already exists");
                        } else {
                            _this2.glass.addEdmAsync(name, version, label).then(function () {
                                res.status(200).end();
                            });
                        }
                    });
                }
            });

            // get an EDM
            this.edmApp.get("/:name/:version", function (req, res, next) {
                var _req$params = req.params,
                    name = _req$params.name,
                    version = _req$params.version;

                _this2.glass.getEdmAsync(name, version).then(function (edm) {
                    res.type("json").send(JSON.stringify(edm));
                });
            });

            // Let's not implement delete yet, we will need to have some
            // kind of premission set up around all this at some point

            // run commands on an EDM
            this.edmApp.post("/:name/:version", function (req, res, next) {
                var _req$params2 = req.params,
                    name = _req$params2.name,
                    version = _req$params2.version;

                var commands = req.body;

                var pane = _this2.panes[name + version];
                if (!pane) {
                    res.status(404).send("EDM " + name + " version " + version + " not found");
                }

                if (!Array.isArray(req.body)) {
                    commands = [commands];
                }

                pane.migrationRunner.migrateAsync(commands).then(function () {
                    return _this2.glass.updateEdmAsync(pane.edm);
                }).then(function () {
                    pane.metaDatabase.refreshTables();
                    res.send('ok');
                }).catch(function (e) {
                    res.status(500).send(e.message);
                });
            });
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=GlassExpressDoor.js.map