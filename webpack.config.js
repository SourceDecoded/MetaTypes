const path = require('path');

module.exports = {
    target: "node",
    entry: './lib/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        libraryTarget: "umd"
    }
};