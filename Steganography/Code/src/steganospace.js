export class Steganography
{
    constructor()
    {
        this.state = "NOT_INIT";
        this.reader = new Reader();

        this.encodeMedium = "";
        this.encodeMessage = "";
        this.encodeSpaces = "";
        this.encodeBitDepth = 0;
        this.encodeResult = "";

        this.decodeRaw = "";
        this.decodeSpaces = "";
        this.decodeBitDepth = 0;
        this.decodeResult = "";
    }

    execution(newState)
    {
        if(newState != null)
        {
            this.state = newState;
        }
        switch (this.state)
        {
            case "ENCODE_READ": //we still need to read the data
                this.preRead("encode_medium", "encodeMedium", "ENCODE_PROCESS");
                break;
            case "DECODE_READ": //we still need to turn it into smart objects
                this.preRead("decode_medium", "decodeRaw", "DECODE_PROCESS");
                break;
            case "ENCODE_PROCESS": //we still need to actually process the data into week-by-week reports
                this.encode();
                break;
            case "DECODE_PROCESS": //write our result to the page
                this.decode();
                break;
            case "ENCODE_RESULT": //write our result to the page
                document.getElementById("result").innerHTML = this.encodeResult;
                break;
            case "DECODE_RESULT": //write our result to the page
            document.getElementById("result").innerHTML = this.decodeResult;
                break;
            default:
                console.warn("Unkown switch case " + this.state + " reached!");
        }
    }

    encode()
    {
        //figure out what spaces we are using and what bit depth we can support
        this.encodeSpaces = document.getElementById("encode_spaces").value;
        var holder = new Array();
        for(var char of this.encodeSpaces)
        {
            holder.push(char.charCodeAt(0));
        }
        this.encodeSpaces = holder;
        this.encodeSpaces = this.encodeSpaces.sort((a, b) => parseInt(a) - parseInt(b));
        this.encodeSpaces = this.encodeSpaces.filter(function(elem, index, self) {return index === self.indexOf(elem);});
        this.encodeBitDepth = this.encodeSpaces.length;

        //build our message
        this.encodeMessage = document.getElementById("encode_message").value;
        this.encodeMessage = encodeURIComponent(this.encodeMessage);
        console.log(this.encodeMessage);
        var holder = "";
        for(var char of this.encodeMessage)
        {
            var baseten = char.charCodeAt(0);
            baseten = this.padLeft(baseten.toString(), 3, "0");
            console.log("Pushing " + baseten);
            holder += baseten;
        }
        console.log(holder);
        holder = BigInt(holder);
        console.log(holder);
        holder = holder.toString(this.encodeBitDepth);
        holder = "1" + holder;
        console.log(holder);
        this.encodeMessage = holder;

        //rebuild message with new spaces
        var words = this.encodeMedium.split(" ");
        if(this.encodeMessage.length >= words.length)
        {
            alert("Steganographic Medium is not large enough to support this message! Aborting!\nAttempted to fit " + this.encodeMessage.length + " characters into " + words.length + " spaces. Add more space characters or increase the medium size.");
            return;
        }
        var messIndex = 0;
        var holder = "";
        for(var i = 0; i < words.length; i++)
        {
            var space = "";
            if(i >= this.encodeMessage.length)
            {
                space = this.getRelativeSpace("0");
            }
            else
            {
                space = this.getRelativeSpace(this.encodeMessage[messIndex]);
            }
            holder += words[i] + space;
            messIndex++;
        }
        this.encodeResult = holder;

        //return to main execution loop
        this.execution("ENCODE_RESULT");
    }

    padLeft(string, length, pad)
    {
        while(string.length < length)
        {
            string = pad + string;
        }
        return string;
    }

    getRelativeSpace(num)
    {
        console.log("getting relative space " + num);
        var holder = "";
        var index = parseInt(num, this.encodeBitDepth);
        console.log("relative space interpereted as " + index);
        holder += String.fromCodePoint(this.encodeSpaces[index]);
        return holder;
    }

    decode()
    {
        //define the spaces that will be used for decoding
        var input = document.getElementById("decode_spaces").value;
        var holder = new Array();
        for(var char of input)
        {
            holder.push(char.charCodeAt(0));
        }
        holder = holder.filter(function(elem, index, self) {return index === self.indexOf(elem);});
        holder = holder.sort();
        this.decodeSpaces = holder;
        this.decodeBitDepth = this.decodeSpaces.length;

        //extract all spaces from the text
        var foundSpaces = "";
        for(var char of this.decodeRaw)
        {
            if(-1 != this.decodeSpaces.indexOf(char.charCodeAt(0)))
            {
                foundSpaces += char;
            }
        }
        this.decodeRaw = foundSpaces.substring(1);

        //convert the decodeRaw into a baseN number
        var digits = "";
        console.log(this.decodeRaw, this.decodeRaw.length);
        for(var char of this.decodeRaw)
        {
            digits += this.decodeSpaces.indexOf(char.charCodeAt(0)).toString(this.decodeBitDepth);
        }
        this.decodeRaw = digits;
        this.decodeRaw = this.baseToBigInt(this.decodeRaw, this.decodeBitDepth);
        this.decodeRaw = this.decodeRaw.toString(10);

        //return to main execution loop
        this.execution("DECODE_RESULT");
    }

    baseToBigInt(numberString, base) {
        let result = BigInt(0);
        for (let i = 0; i < numberString.length; i++) {
            let digit = BigInt(numberString[i]);
            result += digit * BigInt(base) ** BigInt(numberString.length - i - 1);
        }
        return result;
     }

    preRead(id, destination, newState)
    {
        window.main.reader.readAllFilesFromForm(id, function() { window.main.postRead(destination, newState)});
    }

    postRead(destination, newState)
    {
        window.main[destination] = window.main.reader.result;
        this.execution(newState);
    }

    updateEncodeDepth()
    {
        var element = document.getElementById("encode_bitdepth");
        element.innerHTML = element.innerHTML.substring(0, 30) + (document.getElementById("encode_spaces").value.length);
    }

    updateDecodeDepth()
    {
        var element = document.getElementById("decode_bitdepth");
        element.innerHTML = element.innerHTML.substring(0, 30) + (document.getElementById("decode_spaces").value.length);
    }
}

class Reader
{
    constructor()
    {
        this.state = "NOT INIT"; //NOT INIT, READY, RUNNING, DONE
        this.files = new Array();
        this.result = "";
        this.callback;
    }

    elementSetup(formId, callback)
    {
        this.state = "NOT INIT";
        this.callback = callback;
        this.files = document.getElementById(formId).files;
        if(this.files == null)
        {
            console.error("Element with ID " + formId + " does not have a .files attribute!");
            this.result = "ERROR_NO-ATTRIBUTE";
            return;
        }
        else
        {
            if(this.files.length == 0)
            {
                console.error("Element with ID " + formId + " has 0 files assigned!");
                this.result = "ERROR_NO-FILES";
                return;
            }
        }
        this.result = "";
    }

    /**
     * The function `readAllFilesFromForm` reads all files from a form element with a given ID,
     * processes them, and calls a callback function when done.
     * @param formId - The formId parameter is the ID of the HTML form element from which you want to
     * read files from.
     * @param callback - The callback parameter is a function that will be called once all the files
     * have been processed. It is typically used to handle the results of the file processing or
     * perform any additional actions after the files have been read.
     */
    readAllFilesFromForm(formId, callback)
    {
        //console.log("reading files of element with ID " + formId);
        this.elementSetup(formId, callback); //setup elements and file list
        var promises = new Array();

        for (var i = 0; i < this.files.length; i++)
        {
            promises.push(this.subRead(this.files[i]));
        }

        this.state = "READY";
     
        Promise.all(promises).then((results) => {
            this.state = "RUNNING";
            for (let i = 0; i < results.length; i++)
            {
                results[i] = results[i].substring(2, results[i].length-2);
                this.result += results[i] + "\,\n";
            }
            this.result = "\[\n" + this.result.substring(0, this.result.length-2) + "\n\]";
            this.state = "DONE";
            this.callback();
        });
    }

    /**
     * The function `subRead` reads the contents of a single file and returns a promise that resolves with the
     * file's text content.
     * @param file - The "file" parameter is the file object that you want to read. It can be obtained
     * from an input element of type "file" in HTML, or from a file picker dialog in a web application.
     * @returns The function `subRead(file)` is returning a Promise object.
     */
    subRead(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = function(e) {
                reject(e);
            };
            reader.readAsText(file);
        });
    }
     
}

