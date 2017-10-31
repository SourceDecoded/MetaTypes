import express from "express";
import bodyParser from "body-parser";
import busboy from "connect-busboy";
import { Queryable } from "queryablejs";
import Guest from "../user/Guest";
import Admin from "../user/Admin";
import User from "../user/User";
import conditional from "express-conditional-middleware";

export default class {
    constructor(app, pane, authenticator){
        this.enabled = true;
        this.pane = pane;
        this.app = app;
        this.authenticator = authenticator;
    }

    // NOTE: sub-apps and routers can not be removed from an Express app stack,
    // so we wrap the router and use some middleware to short-circuit
    // requests to things we wish we could remove.
    dispose() {
        this.enabled = false;
    }

    attach() {
        let handler = express.Router();
        handler.use((req, res, next) => {
            if (this.enabled) {
                next();
            } else {
                res.status(500).send("This API is no longer valid");
                next();
            }
        });

        handler.use(conditional( (req, res, next) => {
            return !(req.get("X-Query"));
        }, bodyParser.json()
        ));

        handler.use(busboy());

        handler.use((req, res, next) => {
            this.authenticator.authenticateAsync(req).then((user) => {
                req.user = user;
                next();
            }).catch((error) => {
                res.status(403).send({
                    "error":"Forbidden",
                    "developerError":error.stack
                });
            });
        });

        handler.param("model", (req, res, next, model) => {
            let table = this.pane.metaDatabase.getTable(model);
            if (table) {
                req.table = table;
                next();
            } else {
                res.status(500).send({
                    message:`Unknown model: ${model}`,
                    developerMessage:null
                });
            }
        });

        handler.param("id", (req, res, next, id) => {
            let intId = parseInt(id, 10);

            req.table.getEntityByIdAsync(req.user, id).then((result) => {
                req.entity = result;
                next();
            }).catch((e) => {
                res.status(404).send({
                    message:`Could not find id:${id} on ${req.table.name}`,
                    developerMessage: e.stack
                });              
            });
        });

        let handleAdd = function(entity, req, res, next) {
            req.table.addEntityAsync(req.user, entity).then((result) => {
                res.status(201).send(result);
            }).catch((e) => {
                res.status(500).send({
                    message:`Add failed on ${req.table.name}`,
                    developerMessage: e.stack
                });
            });
        }

        let handleQuery = function(query, req, res, next) {
            var queryable = new Queryable(req.table.name);
            if (query) {
                queryable = Queryable.fromJson(query);
            }
            req.table.asQueryable(req.user).merge(queryable).toArrayAsync().then((result) => {
                res.send(result);
            }).catch((e) => {
                res.status(500).send({
                    message:`Could not query "${query}" on ${req.table.name}`,
                    developerMessage: e.stack
                });
            });
        }

        // GET by ID
        handler.get("/:model/:id", (req, res, next) => {
            res.send(req.entity);
            next();
        });
        
        // GET query
        handler.get("/:model", (req, res, next) => {
            handleQuery(req.query.q, req, res, next);
        });

        // GET file
        // TODO: what about MIME types and whatnot?
        handler.get("/:model/:id/file", (req, res, next) => {
            // by convention, we can have a "fileType" property on any
            // entity that wants to make such known to a client.
            if (req.entity.fileType) {
                res.set(req.entity.fileType);
            }            
            req.table.getFileWriteStreamByIdAsync(req.user, req.params.id).then((stream) => {
                res.send(stream);
            }).catch((e) => {
                res.status(500).send({
                    message: `Failed to get file for ${req.params.id} on ${req.table.name}`,
                    developerMessage: e.stack
                });
            });
        });

        // POST new or query
        handler.post("/:model", (req, res, next) => {
            // cleverness award
            (req.get("X-Query") ? handleQuery : handleAdd)(req.body, req, res, next);
        });

        // POST update
        handler.post("/:model/:id", (req, res, next) => {
            req.table.updateEntityAsync(req.user, req.entity, req.body).then((result) => {
                res.send(result);
            }).catch((e) => {
                res.status(500).send({
                    message:`Failed to update id:${id} on ${req.table.name}`,
                    developerMessage: e.stack
                });
            });
        });

        // POST file
        handler.post("/:model/:id/file", (req, res, next) => {
            if (!req.busboy) {
                res.status(500).send("No file found");
            }
            req.table.getFileWriteStreamByIdAsync(req.user, req.params.id).then((stream) => {
                req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                    file.on('data', (data) => {
                        stream.write(data);
                    });
                    file.on('end', () => {
                        stream.end();
                        res.status(200).end();
                    });
                });
            }).catch((e) => {
                res.status(500).send({
                    message:`Failed upload file for id:${id} on ${req.table.name}`,
                    developerMessage: e.stack
                });
            });
        });

        // DELETE entity
        handler.delete("/:model/:id", (req, res, next) => {
            req.table.removeEntityAsync(req.user, req.entity).then((result) => {
                res.status(200).end();
            }).catch((e) => {
                res.status(500).send({
                    message:`Failed to delete id:${id} on ${req.table.name}`,
                    developerMessage: e.stack
                });
            });
        });

        // DELETE file
        handler.delete("/:model/:id/file", (req, res, next) => {
            req.table.removeFileByIdAsync(req.user, req.params.id).then((result) => {
                res.status(200).end();
            }).catch((e) => {
                res.status(500).send({
                    message:`Failed to delete file for id:${id} on ${req.table.name}`,
                    developerMessage: e.stack
                });
            });
        });

        this.app.use(`/${this.pane.edm.name}/${this.pane.edm.version}`, handler);
    }


}