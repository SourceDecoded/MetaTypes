import assert from "assert";
import edm from "../mock/edm";
import GlassDb from "../glassDb/GlassDb";

let testConfig = {
    "dbDriver": {
        "name": "sqlite",
        "options": {
            storageMode: "memory"
        }
    },
    "fileSystem": {
        "name": "not yet implemented",
        "options": {}
    },
    "doors": [
        {
            "name": "express",
            "options": {
                "address": "127.0.0.1",
                "port": "9000"
            }
        }
    ]
};

exports["GlassDb"] = () => {
    let glass = new GlassDb(testConfig);
    assert(glass);
};
