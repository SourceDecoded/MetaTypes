#!/usr/local/bin/node
const CommandBuilder = require('../lib/migration/CommandBuilder').default;
const fs = require('fs');
const path = require('path');

let builder = new CommandBuilder();

let commandHandlers = {
    "addColumn": () => {
        return builder.createAddColumnCommand("TABLENAME", {
            "type": "Integer",
            "name": "id",
            "label": "Identifier",
            "isPrimaryKey": true,
            "isAutoIncrement": true,
            "isNullable": false
        });
    },
    "addDecorator": () => {
        return builder.createAddDecoratorCommand("TABLENAME", {
            name: "Test",
            options: {
                option1: true
            }
        });
    },
    "addOneToOneRelationship": () => {},
    "addOneToManyRelationship": () => {},
    "addTable": () => {},
    "removeColumn": () => {},
    "removeDecorator": () => {},
    "removeOneToOneRelationship": () => {},
    "removeOneToManyRelationship": () => {},
    "removeTable": () => {},
    "updateColumn": () => {},
    "updateDecorator": () => {},
    "updateOneToOne": () => {},
    "updateOneToMany": () => {},
    "updateTable": () => {},
    "commandsFromEDM": () => {
        let source = process.argv[3];
        let destination = process.argv[4];

        let sourceJSON = JSON.parse(fs.readFileSync(source, {encoding:'utf8'}));
        fs.writeFileSync(destination, JSON.stringify(builder.createCommandsFromEdm(sourceJSON), null, 2));
        console.log("done");
    }
};

let command = process.argv[2];

if (!command) {
    console.log(Object.keys(commandHandlers).join("\n"));
} else {
    let handler = commandHandlers[command];
    if (!handler) {
        console.log(`Unknown command: ${command}`);
    } else {
        console.log("=========");
        console.log(JSON.stringify(handler(), null, 2));
        console.log("=========");
    }
}


