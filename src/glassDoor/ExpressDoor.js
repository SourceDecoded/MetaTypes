// GlassExpress
// Implements GlassDoor to expose a GlassDb by HTTP
const express = require("express");

export default class {
    constructor(options) {
        // options.port
        // options.address
    }
}

/*
onst express = require('express');
const bodyParser = require('body-parser');

// use like this:
// app.use('/api', GlassAPIFactory(metaDatabase));

export default function(metaDatabase) {
    if (this !== global) {
        throw new Error("GlassAPIFactory is not a constructor!");
    }

    if (!metaDatabase) {
        throw new Error("Call GlassAPIFactory with a MetaDatabase instance");
    }


    let handler = express.Router();
    handler.use(bodyParser.json());

    // param handlers
    handler.param("model", (req, res, next, model) => {
        // check if "name" is in the edm
        // add the model to the req if so
        // req.model = (get model)
        // else throw
    });

    handler.param("version", (req, res, next, version) => {
        // check if the version is valid for the given model
        // throw if not
    });

    handler.param("id", (req, res, next, id) => {
        // load the entity by id if exists
        // req.entity = (load from metaDatabase)
    });

    handler.param("db", (req, res, next, db) => {
        getDatabaseAsync().then(next);
        
    });

    // GET by ID
    handler.get("/:db/:model/:version/:id", (req, res, next) => {

    });
    // GET query
    handler.get("/:model/:version", (req, res, next) => {
        // we're expecting a queryable on the q parameter
        let query = req.query.q;
    });
    // POST query
    handler.post("/:model/:version", (req, res, next) => {
        // the query should be the post body
        let query = req.body;
    });
    // POST create
    

    return handler;
    
}
*/