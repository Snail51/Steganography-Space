//This class provides a standard way to read in the content of files for processing
export class Reader
{
    constructor(inputElementID)
    {
        this.element = document.getElementById(inputElementID);
        this.data = "";
        this.done = false;
    }

    /**
     * The `readSingleAsBinary()` method is used to read the content of a single file linked
     * to this object as an array of bytes. It is typically used when dealing with binary files.
     * @result returns a file descriptor with data = a Uint8array as a string%8==0
     */
    async readSingleAsBinary()
    {
        this.done = false;
        var file = this.collectMetadata(this.element.files[0]);
        file.data = await this.binaryRead(this.element.files[0]);
        this.done = true;
        return file;
    }

    /**
     * The `readSingleAsBytes()` method is used to read the content of a single file linked
     * to this object as an array of bytes. It is typically used when dealing with binary files.
     * @result returns a file descriptor with data = a Uint8array.
     */
    async readSingleAsBytes()
    {
        this.done = false;
        var file = this.collectMetadata(this.element.files[0]);
        file.data = await this.byteRead(this.element.files[0]);
        this.done = true;
        return file;
    }

    /**
     * The `readSingleAsText()` method is used to read the content of a single file linked
     * to this object as text.
     * @result returns a file descriptor with data = a Uint8array as text.
     */
    async readSingleAsText()
    {
        this.done = false;
        var file = this.collectMetadata(this.element.files[0]);
        file.data = await this.textRead(this.element.files[0]);
        this.done = true;
        return file;
    }

    /**
     * The `readMultipleAsBinary()` method is used to read the content of all files linked
     * to this object as an array of Byte arrays. It is typically used when dealing with binary files.
     * @result returns an array of file descriptors with data = a Uint8array as a string%8==0
     */
    async readMultipleAsBinary()
    {
        this.done = false;
        var multiple = new Array();
        for(var file of this.element.files)
        {
            var single = this.collectMetadata(file);
            single.data = await this.binaryRead(file);
            multiple.push(single);
        }
        this.done = true;
        return multiple;
    }

    /**
     * The `readMultipleAsBytes()` method is used to read the content of all files linked
     * to this object as an array of Byte arrays. It is typically used when dealing with binary files.
     * @result returns an array of file descriptors with data = a Uint8array.
     */
    async readMultipleAsBytes()
    {
        this.done = false;
        var multiple = new Array();
        for(var file of this.element.files)
        {
            var single = this.collectMetadata(file);
            single.data = await this.byteRead(file);
            multiple.push(single);
        }
        this.done = true;
        return multiple;
    }

    /**
     * The `readMultipleAsText()` method is used to read the content of all files linked
     * to this object as an array of Text arrays.
     * @result returns an array of file descriptors with data = a Uint8array as text
     */
    async readMultipleAsText()
    {
        this.done = false;
        var multiple = new Array();
        for(var file of this.element.files)
        {
            var single = this.collectMetadata(file);
            single.data = await this.textRead(file);
            multiple.push(single);
        }
        this.done = true;
        return multiple;
    }

    /**
     * The function collects metadata (name, type, size) for each file in a given file list.
     * @returns an array of objects. Each object contains the metadata of a file, including the file
     * name, file type, file size, and an empty data property.
     */
    collectMetadata(file)
    {
        var obj = ({
            name: file.name,
            type: file.type,
            size: file.size,
            data: ""
        });
        return obj;
    }

    /**
     * The function `textRead` reads the contents of a file and returns it as a string.
     * @param file - The "file" parameter is the file object that you want to read. It could be a file
     * selected by the user through an input element or obtained from any other source.
     * @returns the variable "data", which is the file's contents.
     */
    async textRead(file)
    {
        this.data = "";
        var readingPromise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = function(e) {
                reject(e);
            };
            reader.readAsText(file);
        });
        await readingPromise.then((results) => {
            this.data = results;
        });
        return this.data
    }

    /**
     * The function `binaryRead` reads the contents of a file and returns it as a binary string.
     * @param file - The "file" parameter is the file object that you want to read. It could be a file
     * selected by the user through an input element or obtained from any other source.
     * @returns the variable "data", which is the file's contents as Uint8array as string%8==0
     */
    async binaryRead(file)
    {
        this.data = "";
        var readingPromise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = function(e) {
                reject(e);
            };
            reader.readAsArrayBuffer(file);
        });
        await readingPromise.then((results) => {
            var holder = new Uint8Array(results);
            var result = "";
            for(var byte of holder)
            {
                var b = byte.toString(2);
                b = padLeft(b, 8, "0");
                result += b;
            }
            this.data = result;

            function padLeft(string, length, pad)
            {
                var result = string;
                while(result.length < length)
                {
                    result = pad + result;
                }
                return result;
            }
        });
        return this.data
    }

    /**
     * The function `byteRead` reads the contents of a file and returns it as a binary string.
     * @param file - The "file" parameter is the file object that you want to read. It could be a file
     * selected by the user through an input element or obtained from any other source.
     * @returns the variable "data", which is the file's contents as Uint8array.
     */
    async byteRead(file)
    {
        this.data = "";
        var readingPromise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = function(e) {
                reject(e);
            };
            reader.readAsArrayBuffer(file);
        });
        await readingPromise.then((results) => {
            var holder = new Uint8Array(results);
            this.data = holder;
        });
        return this.data
    }
}