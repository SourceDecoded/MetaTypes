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

        this.app = express();

        _init();
    }

    _init() {
        this.panes.forEach((pane) => {
            let router = new Router(this.app, pane);
            this.entityRouters[edm.name] = router;
            router.attach(this.apiRoot);
        });

        // TODO: build the /edm endpoint once we know how it should work
    }

}