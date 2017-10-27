// GlassExpress
// Implements GlassDoor to expose a GlassDb by HTTP
import express from "express";
import DataRouter from "./GlassExpressDataRouter";
import EDMApp from "./GlassExpressEDMRouter";
import bodyParser from "body-parser";

export default class {
    constructor(options) {
        this.port = options.port || "8888";
        this.address = options.address || "127.0.0.1";
        this.apiRoot = options.apiRoot || "/api";
        this.edmRoot = options.edmRoot || "/edm";
        this.glass = options.glass;
        this.panes = {};
        this.entityRouters = {};
        this.edmRouters = {};

        this.mainApp = express();
        this.dataApp = express();
        this.edmApp = express();
        this.edmApp.use(bodyParser.json());

        this._nativeHTTPServer = this.mainApp.listen(this.port, this.address, (err) => {
            if (!err) {
                this.mainApp.use(this.apiRoot, this.dataApp);
                this.mainApp.use(this.edmRoot, this.edmApp);
                console.log(`ExpressDoor is listening on ${this.address}:${this.port} `);
                console.log(`Data API mounted at ${this.apiRoot}`);
                console.log(`EDM API mounted at ${this.edmRoot}`);
                this._init();
            } else {
                throw err;
            }
        });
    }

    dispose() {
        if (this._nativeHTTPServer) {
            this._nativeHTTPServer.close();
            this._nativeHTTPServer = null;
        }
    }

    addPane(pane) {
        let {name, version} = pane.edm;
        let router = new DataRouter(this.dataApp, pane);
        this.entityRouters[name + version] = router;
        router.attach();

        let edmRouter = new EDMApp(this.edmApp, pane);
        this.edmRouters[name + version] = edmRouter;
        edmRouter.attach();

        this.panes[name + version] = pane;
    }

    removePane(pane) {
        let {name, version} = pane.edm;
        let myPane = this.panes[name + version];
        let edmRouter = this.edmRouters[name + version];
        let entityRouter = this.entityRouters[name + version];

        edmRouter.dispose();
        entityRouter.dispose();

        this.panes[name + version] = null;
        this.edmRouters[name + version] = null;
        this.entityRouters[name + version] = null;
    }

    _init() {

        // Set up Express handlers for dealing with EDMs
        // add a new EDM
        this.edmApp.post("/", (req, res, next) => {
            let {name, version, label} = req.body;
            if(!name || !version) {
                res.status(500).send("Name and version required");
            } else {
                this.glass.getEdmAsync(name, version).then((edm) => {
                    if (edm) {
                        res.status(500).send("EDM with that name and version already exists");
                    } else {
                        this.glass.addEdmAsync(name, version, label).then(()=> {
                            res.status(200).end();
                        });
                    }
                });
            }
        });

        // get an EDM
        this.edmApp.get("/:name/:version", (req, res, next) => {
            let {name, version} = req.params;
            this.glass.getEdmAsync(name, version).then((edm) => {
                res.type("json").send(JSON.stringify(edm));
            });
        });
        
        // Let's not implement delete yet, we will need to have some
        // kind of premission set up around all this at some point
    }

}