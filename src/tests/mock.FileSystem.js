import assert from "assert";
import FileSystem from "./../mock/FileSystem";

exports["mock.FileSystem: getReadStreamAsync"] = () => {
    let fileSystem = new FileSystem();
    let fileName = "Mock File.txt";
    let fileContent = "Hello World!";

    fileSystem.files[fileName] = fileContent;

    fileSystem.getReadStreamAsync(fileName).then((stream) => {
        return new Promise((resolve, reject) => {
            let data = "";

            stream.on("data", (d) => {
                data += d;
            });

            stream.on("end", () => {
                assert.equal(data, fileContent);
            });
        });
    });
}

exports["mock.FileSystem: getWriteStreamAsync"] = () => {
    let fileSystem = new FileSystem();
    let fileName = "Mock File.txt";
    let fileContent = "Hello World!";

    fileSystem.getWriteStreamAsync(fileName).then((stream) => {
        return new Promise((resolve, reject) => {
            stream.write(fileContent);
            stream.end();

            assert.equal(fileSystem.files[fileName], fileContent);
        });
    });
}

exports["mock.FileSystem: removeFileAsync"] = () => {
    let fileSystem = new FileSystem();
    let fileName = "Mock File.txt";

    fileSystem.files[fileName] = "Hello World!";

    fileSystem.removeFileAsync(fileName).then(() => {
        assert.equal(fileSystem.files[fileName], null);
    });
}

exports["mock.FileSystem: getFileSizeAsync"] = () => {
    let fileSystem = new FileSystem();
    let fileName = "Mock File.txt";
    let fileContent = "Hello World!";

    fileSystem.files[fileName] = fileContent;

    let size = Buffer.byteLength(fileContent, 'utf8');

    fileSystem.getFileSizeAsync(fileName).then((s) => {
        assert.equal(s, size);
    });
}