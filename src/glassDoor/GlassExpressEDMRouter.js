import express from "express";
import bodyParser from "body-parser";

// listen to

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
            // get the commands
        });

        this.app.use(`/${this.pane.edm.name}/${this.pane.edm.version}`, handler);
    }
}