"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _connectBusboy = require("connect-busboy");

var _connectBusboy2 = _interopRequireDefault(_connectBusboy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(mainApp, pane) {
        _classCallCheck(this, _class);

        this.enabled = true;
        this.pane = pane;
        attach(apiRoot);
    }

    // NOTE: sub-apps and routers can not be removed from an Express app stack,
    // so we wrap the router and use some middleware to short-circuit
    // requests to things we wish we could remove.


    _createClass(_class, [{
        key: "dispose",
        value: function dispose() {
            this.enabled = false;
        }
    }, {
        key: "attach",
        value: function attach(apiRoot) {
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
            handler.use((0, _connectBusboy2.default)());

            handler.use(function (req, res, next) {
                // add the user to req
                // TODO: actually add the user to req
                req.user = {};
                next();
            });

            handler.param("model", function (req, res, next, model) {
                var table = _this.pane.metaDatabase.getTable(model);
                if (table) {
                    req.table = table;
                    next();
                } else {
                    res.status(500).send("Unknown model: " + model);
                }
            });

            handler.param("version", function (req, res, next, version) {
                // verify version is valid for given model
                // else throw
                next();
            });

            handler.param("id", function (req, res, next, id) {
                var intId = parseInt(id, 10);

                req.table.getEntityByIdAsync(user, id).then(function (result) {
                    req.entity = result;
                    next();
                }).catch(function (e) {
                    res.status(404).send("Could not find id:" + id + " on " + table.name);
                });
            });

            var handleAdd = function handleAdd(entity, req, res, next) {
                req.table.addEntityAsync(entity).then(function (result) {
                    res.status(201).send(result);
                }).catch(function (e) {
                    res.status(500).send(e);
                });
            };

            var handleQuery = function handleQuery(query, req, res, next) {
                req.table.asQueryable(req.user).where().toArrayAsync().then(function (result) {
                    res.send(result);
                }).catch(function (e) {
                    res.status(500).send(e);
                });
            };

            // GET by ID
            handler.get("/:model/:version/:id", function (req, res, next) {
                res.send(req.entity);
            });

            // GET query
            handler.get("/:model/:version", function (req, res, next) {
                handleQuery(req.query.q, req, res, next);
            });

            // GET file
            // TODO: what about MIME types and whatnot?
            handler.get("/:model/:version/:id/file", function (req, res, next) {
                // by convention, we can have a "fileType" property on any
                // entity that wants to make such known to a client.
                if (req.entity.fileType) {
                    res.set(req.entity.fileType);
                }
                req.table.getFileWriteStreamByIdAsync(req.user, req.params.id).then(function (stream) {
                    res.send(stream);
                }).catch(function (e) {
                    res.status(500).send(e);
                });
            });

            // POST new or query
            handler.post("/:model/:version", function (req, res, next) {
                // cleverness award
                // TODO: too clever?
                (req.get("X-Query") ? handleQuery : handleAdd)(req.body, req, res, next);
            });

            // POST update
            handler.post(":/model/:version/:id", function (req, res, next) {
                req.table.updateEntityAsync(req.user, req.entity, req.body).then(function (result) {
                    res.send(result);
                }).catch(function (e) {
                    res.status(500).send(e);
                });
            });

            // POST file
            handler.post(":/model/:version/:id/file", function (req, res, next) {
                if (!req.busboy) {
                    res.status(500).send("No file found");
                }
                req.table.getFileWriteStreamByIdAsync(req.user, req.params.id).then(function (stream) {
                    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                        file.on('data', function (data) {
                            stream.write(data);
                        });
                        file.on('end', function () {
                            stream.end();
                            res.status(200).end();
                        });
                    });
                }).catch(function (e) {
                    res.status(500).send(e);
                });
            });

            // DELETE entity
            handler.delete(":/model/:version/:id", function (req, res, next) {
                req.table.removeEntityAsync(req.user, req.entity).then(function (result) {
                    res.status(200).end();
                }).catch(function (e) {
                    res.status(500).send(e);
                });
            });

            // DELETE file
            handler.delete(":/model/:version/:id/file", function (req, res, next) {
                req.table.removeFileByIdAsync(req.user, req.params.id).then(function (result) {
                    res.status(200).end();
                }).catch(function (e) {
                    res.status(500).send(e);
                });
            });

            this.mainApp.use(apiRoot + "/" + this.pane.edm.name, handler);
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=GlassExpressRouter.js.map