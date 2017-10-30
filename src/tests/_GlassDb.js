import assert from "assert";
import edm from "../mock/edm";
import GlassDb from "../glassDb/GlassDb";

// let testConfig = {
//     "dbDriver": {
//         "name": "sqlite",
//         "options": {
//             storageMode: "memory"
//         }
//     },
//     "fileSystem": {
//         "name": "not yet implemented",
//         "options": {}
//     },
//     "doors": [
//         {
//             "name": "express",
//             "options": {
//                 "address": "127.0.0.1",
//                 "port": "9000"
//             }
//         }
//     ]
// };

let testConfig = {
    "dbDriver": {
        "name": "mssql",
        "options": {
            user: process.env.META_DB_TEST_USER,
            password: process.env.META_DB_TEST_PW,
            server: process.env.META_DB_TEST_SERVER,
            database: process.env.META_DB_TEST_DB,
            dataDb: process.env.META_DB_TEST_DB_DATA,
            edmDb: process.env.META_DB_TEST_DB_EDM,
            edmSchema: "dbo",
            dataSchema: "dbo"
        }
    },
    "fileSystem": {
        "name": "not yet implemented",
        "options": {}
    },
    "doors": [
        // {
        //     "name": "express",
        //     "options": {
        //         "address": "127.0.0.1",
        //         "port": "9000"
        //     }
        // }
    ]
};

exports["GlassDb"] = () => {
    let glass = new GlassDb(testConfig);
    assert(glass);
    glass.dispose();
};

// finish the sqlite driver so we can test this without pounding the mssql server

exports["GlassDb add, get, delete edm"] = () => {
    let glass = new GlassDb(testConfig);
    glass.addEdmAsync("newEDM", "0.0.3", "A Test EDM").then(() => {
        return glass.getEdmAsync("newEdm", "0.0.3");
    }).then((edm) => {
        assert(edm.name === "newEDM");
        return glass.deleteEdmAsync("newEDM", "0.0.3");
    }).then(() => {
        return glass.getEdmAsync("newEDM", "0.0.3");
    }).then((noEDM) => {
        assert.equal(noEDM, null);
        glass.dispose();
    });
};
