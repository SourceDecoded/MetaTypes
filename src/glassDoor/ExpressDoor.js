// GlassExpress
// Implements GlassDoor to expose a GlassDb by HTTP
import express from "express";
import Router from "./GlassExpressRouter";

export default class {
    constructor(options) {
        this.port = options.port || "8888";
        this.address = options.address || "127.0.0.1";
        this.apiRoot = options.apiRoot || "/api";
        this.edmRoot = options.edmRoot || "/edm";
        this.glass = options.glass;
        this.panes = this.glass.panes;
        this.entityRouters = {};

        this.mainApp = express();
        this.dataApp = express();
        this.edmApp = express();

        mainApp.listen(this.port, this.address, (err) => {
            if (!err) {
                this.mainApp.use(this.apiRoot, this.dataApp);
                this.mainApp.use(this.edmRoot, this.edmApp);
                console.log(`ExpressDoor is listening on ${this.port}:${this.address} `);
                console.log(`Data API mounted at ${this.apiRoot}`);
                console.log(`EDM API mounted at ${this.edmRoot}`);
                _init();
            } else {
                throw err;
            }
        });
    }

    _init() {
        this.panes.forEach((pane) => {
            let router = new Router(this.dataApp, pane);
            this.entityRouters[edm.name] = router;
            router.attach();
        });

        // TODO: build the /edm endpoint once we know how it should work
    }

}