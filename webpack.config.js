const path = require('path');

module.exports = {
    target: "node",
    entry: './lib/index.js',
    externals: [
        "sqlite"
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        libraryTarget: "umd"
    }
};