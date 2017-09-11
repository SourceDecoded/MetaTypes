import path from "path";
import fileSystem from "fs-extra";

export default class LocalFileSystem {
    constructor({ rootFilePath }) {
        if (rootFilePath == null) {
            throw new Error("Null Argument Exception: File System needs to have a rootFilePath.");
        }

        this.rootFilePath = rootFilePath;
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