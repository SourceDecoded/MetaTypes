const path = require('path');

module.exports = {
    node: {
        // This is for a bug https://github.com/webpack-contrib/css-loader/issues/447
        // Without it, it won't compile.
        fs: "empty"
    },
    entry: './lib/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        libraryTarget: "umd"
    }
};