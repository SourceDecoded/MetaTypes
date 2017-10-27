import express from "express";
import bodyParser from "body-parser";

export default class {
    constructor (app, pane){
        this.app = app;
        this.pane = pane;
        this.enabled = true;
    }

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
            }
        });
        handler.use(bodyParser.json());

        handler.post("/:name/:version", (req, res, next) => {
            let {name, version} = req.params;
            let commands = req.body;
            if (!Array.isArray(req.body)) {
                commands = [commands];
            }
            this.pane.migrationRunner.migrateAsync(commands).then(() => {
                res.send('ok');
            }).catch((e) => {
                res.status(500).send(e.message);
            });
        });

        this.app.use(handler);
    }
}