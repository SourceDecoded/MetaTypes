var fs = require('fs');
var buildDirectory = process.argv[2];

let recursiveClean = function(dir){
    let files = fs.readdirSync(dir);
    files.forEach((file) => {
        if (fs.statSync(dir+"/"+file).isDirectory()) {
            recursiveClean(dir+"/"+file);
        } else {
            fs.unlinkSync(dir+"/"+file);
        }
    });
    fs.rmdirSync(dir);
};

recursiveClean(buildDirectory);
fs.mkdirSync(buildDirectory);
