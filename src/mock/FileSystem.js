import { Readable, Writable } from "stream";

class FileWritable extends Writable {
    constructor(files, path) {
        super();
        this.files = files;
        this.path = path;

        this.files[path] = "";
    }

    _write(chunk, encoding, next) {
        this.files[this.path] += chunk;
        next();
    }
}

export default class FileSystem {
    constructor() {
        this.files = {};
    }

    getReadStreamAsync(path) {
        if (this.files[path] == null) {
            throw new Error("File didn't exist.");
        }

        let readStream = new Readable();
        readStream.push(this.files[path]);
        readStream.push(null);

        return Promise.resolve(readStream);
    }

    getWriteStreamAsync(path) {
        let writeStream = new FileWritable(this.files, path);
        return Promise.resolve(writeStream);
    }

    removeFileAsync(path) {
        if (this.files[path] == null) {
            throw new Error("File didn't exist.");
        }

        this.files[path] = null;

        return Promise.resolve();
    }
}