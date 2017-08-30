import assert from "assert";
import Database from "./../sqlite/Database";
import edm from "./../mock/edm";

exports["Database._getTableBuildOrder"] = () => {
    var database = new Database({
        sqlite: {
            exec() {

            },
            run() {

            }
        },
        edm: edm
    });

    let buildOrder = database._getTableBuildOrder();

};
