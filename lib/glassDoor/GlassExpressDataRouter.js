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

var _queryablejs = require("queryablejs");

var _Guest = require("../user/Guest");

var _Guest2 = _interopRequireDefault(_Guest);

var _Admin = require("../user/Admin");

var _Admin2 = _interopRequireDefault(_Admin);

var _User = require("../user/User");

var _User2 = _interopRequireDefault(_User);

var _expressConditionalMiddleware = require("express-conditional-middleware");

var _expressConditionalMiddleware2 = _interopRequireDefault(_expressConditionalMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(app, pane, authenticator) {
        _classCallCheck(this, _class);

        this.enabled = true;
        this.pane = pane;
        this.app = app;
        this.authenticator = authenticator;
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
        value: function attach() {
            var _this = this;

            var handler = _express2.default.Router();
            handler.use(function (req, res, next) {
                if (_this.enabled) {
                    next();
                } else {
                    res.status(500).send("This API is no longer valid");
                    next();
                }
            });

            handler.use((0, _expressConditionalMiddleware2.default)(function (req, res, next) {
                return !req.get("X-Query");
            }, _bodyParser2.default.json()));

            handler.use((0, _connectBusboy2.default)());

            handler.use(function (req, res, next) {
                _this.authenticator.authenticateAsync(req).then(function (user) {
                    req.user = user;
                    next();
                }).catch(function (error) {
                    res.status(403).send({
                        "error": "Forbidden",
                        "developerError": error.stack
                    });
                });
            });

            handler.param("table", function (req, res, next, tableName) {
                var table = _this.pane.metaDatabase.getTable(tableName);
                if (table) {
                    req.table = table;
                    next();
                } else {
                    res.status(500).send({
                        message: "Unknown table: " + tableName,
                        developerMessage: null
                    });
                }
            });

            handler.param("id", function (req, res, next, id) {
                var intId = parseInt(id, 10);

                req.table.getEntityByIdAsync(req.user, id).then(function (result) {
                    req.entity = result;
                    next();
                }).catch(function (e) {
                    res.status(404).send({
                        message: "Could not find id:" + id + " on " + req.table.name,
                        developerMessage: e.stack
                    });
                });
            });

            var handleAdd = function handleAdd(entity, req, res, next) {
                req.table.addEntityAsync(req.user, entity).then(function (result) {
                    res.status(201).send(result);
                }).catch(function (e) {
                    res.status(500).send({
                        message: "Add failed on " + req.table.name,
                        developerMessage: e.stack
                    });
                });
            };

            var handleQuery = function handleQuery(query, req, res, next) {
                var queryable = new _queryablejs.Queryable(req.table.name);
                if (query) {
                    queryable = _queryablejs.Queryable.fromJson(query);
                }
                var finalQueryable = req.table.asQueryable(req.user).merge(queryable);

                var resultPromise = void 0;
                if (req.query.count) {
                    resultPromise = finalQueryable.countAsync().then(function (count) {
                        return { count: count };
                    });
                } else if (req.query.withCount) {
                    resultPromise = finalQueryable.toArrayWithCountAsync();
                } else {
                    resultPromise = finalQueryable.toArrayAsync();
                }

                resultPromise.then(function (result) {
                    res.send(result);
                }).catch(function (e) {
                    res.status(500).send({
                        message: "Could not query \"" + query + "\" on " + req.table.name,
                        developerMessage: e.stack
                    });
                });
            };

            // GET EDM action
            handler.get('/@\*', function (req, res, next) {
                var actionName = req.params[0];
                var options = {};
                options.query = req.query.q;
                options.user = req.user;
                _this.pane.executeEdmActionAsync(actionName, options).then(function (result) {
                    res.send(result);
                }).catch(function (error) {
                    res.status(404).send({
                        "error": error.message,
                        "actionScope": "edm",
                        "actionName": actionName
                    });
                });
            });

            // POST EDM action
            handler.post('/@\*', function (req, res, next) {
                var actionName = req.params[0];
                var options = {};
                options.query = req.query.q;
                options.body = req.body;
                options.user = req.user;
                _this.pane.executeEdmActionAsync(actionName, options).then(function (result) {
                    res.send(result);
                }).catch(function (error) {
                    res.status(404).send({
                        "error": error.message,
                        "actionName": actionName
                    });
                });
            });

            // GET table action
            handler.get("/:table/@\*", function (req, res, next) {
                var actionName = req.params[0];
                var options = {};
                options.query = req.query.q;
                options.user = req.user;
                _this.pane.executeTableActionAsync(req.params.table, actionName, options).then(function (result) {
                    res.send(result);
                }).catch(function (error) {
                    res.status(404).send({
                        "error": error.message,
                        "actionName": actionName,
                        "actionScope": "table",
                        "table": req.params.table
                    });
                });
            });

            // POST table action
            handler.post("/:table/@\*", function (req, res, next) {
                var actionName = req.params[0];
                var options = {};
                options.query = req.query.q;
                options.user = req.user;
                options.body = req.body;
                _this.pane.executeTableActionAsync(req.params.table, actionName, options).then(function (result) {
                    res.send(result);
                }).catch(function (error) {
                    res.status(404).send({
                        "error": error.message,
                        "actionName": actionName,
                        "actionScope": "table",
                        "table": req.params.table
                    });
                });
            });

            // GET entity action
            handler.get("/:table/:id/@\*", function (req, res, next) {
                var actionName = req.params[0];
                var options = {};
                options.query = req.query.q;
                options.user = req.user;
                options.entity = req.entity;
                _this.pane.executeEntityActionAsync(req.params.table, actionName, options).then(function (result) {
                    res.send(result);
                }).catch(function (error) {
                    res.status(404).send({
                        "error": error.message,
                        "actionName": actionName,
                        "actionScope": "entity",
                        "table": req.params.table
                    });
                });
            });

            // POST entity action
            handler.post("/:table/:id/@\*", function (req, res, next) {
                var actionName = req.params[0];
                var options = {};
                options.query = req.query.q;
                options.user = req.user;
                options.body = req.body;
                options.entity = req.entity;
                _this.pane.executeEntityActionAsync(req.params.table, actionName, options).then(function (result) {
                    res.send(result);
                }).catch(function (error) {
                    res.status(404).send({
                        "error": error.message,
                        "actionName": actionName,
                        "actionScope": "entity",
                        "table": req.params.table
                    });
                });
            });

            // GET by ID
            handler.get("/:table/:id", function (req, res, next) {
                res.send(req.entity);
                next();
            });

            // GET query
            handler.get("/:table", function (req, res, next) {
                handleQuery(req.query.q, req, res, next);
            });

            // GET file
            // TODO: what about MIME types and whatnot?
            handler.get("/:table/:id/file", function (req, res, next) {
                // by convention, we can have a "fileType" property on any
                // entity that wants to make such known to a client.
                if (req.entity.fileType) {
                    res.set(req.entity.fileType);
                }
                req.table.getFileWriteStreamByIdAsync(req.user, req.params.id).then(function (stream) {
                    res.send(stream);
                }).catch(function (e) {
                    res.status(500).send({
                        message: "Failed to get file for " + req.params.id + " on " + req.table.name,
                        developerMessage: e.stack
                    });
                });
            });

            // POST new or query
            handler.post("/:table", function (req, res, next) {
                // cleverness award
                (req.get("X-Query") ? handleQuery : handleAdd)(req.body, req, res, next);
            });

            // POST update
            handler.post("/:table/:id", function (req, res, next) {
                req.table.updateEntityAsync(req.user, req.entity, req.body).then(function (result) {
                    res.send(result);
                }).catch(function (e) {
                    res.status(500).send({
                        message: "Failed to update id:" + id + " on " + req.table.name,
                        developerMessage: e.stack
                    });
                });
            });

            // POST file
            handler.post("/:table/:id/file", function (req, res, next) {
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
                    res.status(500).send({
                        message: "Failed upload file for id:" + id + " on " + req.table.name,
                        developerMessage: e.stack
                    });
                });
            });

            // DELETE entity
            handler.delete("/:table/:id", function (req, res, next) {
                req.table.removeEntityAsync(req.user, req.entity).then(function (result) {
                    res.status(200).end();
                }).catch(function (e) {
                    res.status(500).send({
                        message: "Failed to delete id:" + id + " on " + req.table.name,
                        developerMessage: e.stack
                    });
                });
            });

            // DELETE file
            handler.delete("/:table/:id/file", function (req, res, next) {
                req.table.removeFileByIdAsync(req.user, req.params.id).then(function (result) {
                    res.status(200).end();
                }).catch(function (e) {
                    res.status(500).send({
                        message: "Failed to delete file for id:" + id + " on " + req.table.name,
                        developerMessage: e.stack
                    });
                });
            });

            this.app.use("/" + this.pane.edm.name + "/" + this.pane.edm.version, handler);
        }
    }]);

    return _class;
}();

exports.default = _class;
//# sourceMappingURL=GlassExpressDataRouter.js.map