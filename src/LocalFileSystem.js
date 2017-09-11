import path from "path";
import defaultFileSystem from "fs-extra";

export default class LocalFileSystem {
    constructor({ rootFilePath, fileSystem }) {

        if (rootFilePath == null) {
            throw new Error("Null Argument Exception: File System needs to have a rootFilePath.");
        }

        this.rootFilePath = rootFilePath;
        this.fileSystem = fileSystem || defaultFileSystem;
    }

    getReadStreamAsync(path) {
        let fileStream = fileSystem.createReadStream(path);
        return Promise.resolve(fileStream);
    }

    removeFileAsync(path) {
        return fileStream.unlink(path);
    }

    getWriteStreamAsync(path) {
        let fileStream = fileSystem.createWriteStream(path);
        return Promise.resolve(fileStream);
    }

}