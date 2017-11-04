// GlassExpress
// Implements GlassDoor to expose a GlassApi by HTTP
import express from "express";
import DataRouter from "./GlassExpressDataRouter";
import bodyParser from "body-parser";
import GlassGuestAuthenticator from "./GlassGuestAuthenticator";

export default class {
    constructor(options) {
        this.port = options.port || "8888";
        this.address = options.address || "127.0.0.1";
        this.apiRoot = options.apiRoot || "/data";
        this.edmRoot = options.edmRoot || "/edm";
        this.glass = options.glass;
        this.panes = {};
        this.entityRouters = {};
        this.mainApp = express();
        this.dataApp = express();
        this.edmApp = express();
        this.edmApp.use(bodyParser.json());
        this.authenticator = this.glass.authenticator || GlassGuestAuthenticator;

        this._nativeHTTPServer = this.mainApp.listen(this.port, this.address, (err) => {
            if (!err) {
                this.mainApp.use(this.apiRoot, this.dataApp);
                this.mainApp.use(this.edmRoot, this.edmApp);
                console.log(`ExpressDoor is listening on ${this.address}:${this.port} `);
                console.log(`Data API mounted at ${this.apiRoot}`);
                console.log(`EDM API mounted at ${this.edmRoot}`);

                this.mainApp.get('/@\*', (req, res, next) => {
                    let options = {
                        query: req.query.q
                    };
                    let actionName = req.params[0];
                    this.glass.executeApiActionAsync(actionName, options).then((result) => {
                        res.send(result);
                    }).catch((error) => {
                        res.status(404).send({error: error.message});
                    });
                });

                this.mainApp.post('/@\*', (req, res, next) => {
                    let options = {
                        query: req.query.q,
                        body: req.body
                    };
                    let actionName = req.params[0];
                    this.glass.executeApiActionAsync(actionName, options).then((result) => {
                        res.send(result);
                    }).catch((error) => {
                        res.status(404).send({error: error.message});
                    });
                });

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
        let router = new DataRouter(this.dataApp, pane, this.authenticator);
        this.entityRouters[name + version] = router;
        router.attach();

        this.panes[name + version] = pane;
    }

    removePane(pane) {
        let {name, version} = pane.edm;
        let myPane = this.panes[name + version];
        let entityRouter = this.entityRouters[name + version];

        entityRouter.dispose();

        this.panes[name + version] = null;
        this.entityRouters[name + version] = null;
    }

    _init() {

        // Set up Express handlers for dealing with EDMs
        // add a new EDM
        this.edmApp.post("/", (req, res, next) => {
            let {name, version, label} = req.body;
            label = label || name;
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

        // run commands on an EDM
        this.edmApp.post("/:name/:version", (req, res, next) => {
            let {name, version} = req.params;
            let commands = req.body;

            let pane = this.panes[name+version];
            if (!pane) {
                res.status(404).send(`EDM ${name} version ${version} not found`);
            }

            if (!Array.isArray(req.body)) {
                commands = [commands];
            }

            pane.migrationRunner.migrateAsync(commands).then(() => {
                return this.glass.updateEdmAsync(pane.edm);
            }).then(() => {
                pane.metaDatabase.refreshTables();
                res.send('ok');
            }).catch((e) => {
                res.status(500).send(e.message);
            });
        });

    }

}