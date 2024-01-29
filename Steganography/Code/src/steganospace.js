export class Steganography
{
    constructor()
    {
        this.state = "NOT_INIT";
        this.reader = new Reader();



        this.encodeMedium = "";
        this.encodeMessage = "";
        this.encodeBitDepth = 11;
        this.encodeResult = "";

        this.decodeRaw = "";
        this.decodeBitDepth = 11;
        this.decodeResult = "";


        //decide what spaces will be used
        this.spaces = "";
        this.spaceType = "BILLIARDS"; //SPACE, BILLIARDS
        switch(this.spaceType)
        {
            case "BILLIARDS":
                this.spaces = "⓪①②③④⑤⑥⑦⑧⑨Ⓐ";
                break;
            case "SPACE":
                this.spaces = "\u0020\u00A0\u2000\u2002\u2004\u2005\u2006\u2008\u2009\u202F\u205F";
                break;
            default:
                console.error("Invalid spaceType set in steganospace constructor");
                this.spaces = null;
                break;
        }
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
        //build our message
        this.encodeMessage = document.getElementById("encode_message").value;
        this.encodeMessage = encodeURIComponent(this.encodeMessage);
        console.log(this.encodeMessage);
        var holder = "";
        for(var char of this.encodeMessage)
        {
            var baseten = char.charCodeAt(0); //get base10 integer of char code
            var basetwo = baseten.toString(2); //convert to base2 string
            basetwo = this.padLeft(basetwo, 7, "0"); //add 0s to the left until the string is of length 7 (2^7 is 128 which covers ascii)
            console.log("Pushing " + basetwo);
            holder =  basetwo + holder;
        }
        holder = "1" + holder + "1"; //make sure we can identify leading and trailing 0's
        console.log(holder);
        var aggrten = this.baseToBigInt(holder, 2);
        console.log("aggr10", aggrten);
        var aggreleven = aggrten.toString(11);
        console.log("aggr11", aggreleven);
        
        this.encodeMessage = aggreleven;

        //rebuild message with new spaces
        var words = this.encodeMedium.split(" ");
        if(this.encodeMessage.length >= words.length)
        {
            alert("Steganographic Medium is not large enough to support this message! Aborting!\nAttempted to fit " + this.encodeMessage.length + " characters into " + words.length + " spaces. Add more space characters or increase the medium size.");
            return;
        }

        document.getElementById("result").innerHTML = "Calculating... Please Wait.";

        var messIndex = 0;
        var holder = "";
        for(var i = 0; i < words.length; i++)
        {
            var space = "";
            if(i >= this.encodeMessage.length)
            {
                space = this.spaces[0];
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
        var holder = "";
        var index = parseInt(num, this.encodeBitDepth);
        console.log("using space [" + num + "] - U+" + this.padLeft(this.spaces[index].charCodeAt(0).toString(16), 4, "0"));
        holder += this.spaces[index];
        return holder;
    }

    decode()
    {
        document.getElementById("result").innerHTML = "Calculating... Please Wait.";
        
        //extract all spaces from the text
        var foundSpaces = "";
        for(var char of this.decodeRaw)
        {
            if(-1 != this.spaces.indexOf(char))
            {
                foundSpaces += char;
            }
        }
        console.log("found spaces", foundSpaces.length);
        this.decodeRaw = foundSpaces;

        //convert the decodeRaw into a baseN number
        var digits = "";
        console.log(this.decodeRaw, this.decodeRaw.length);
        for(var char of this.decodeRaw)
        {
            digits += this.spaces.indexOf(char).toString(this.decodeBitDepth);
        }
        console.log(digits);
        digits = digits.replace(/0+$/gm, "");
        console.log("digits", digits);
        this.decodeRaw = digits;
    
        this.decodeRaw = this.baseToBigInt(this.decodeRaw, this.decodeBitDepth);
        this.decodeRaw = this.decodeRaw.toString(2);
        this.decodeRaw = this.decodeRaw.substring(1, this.decodeRaw.length - 1);

        var regions = new Array();
        for(var i = 0; i < this.decodeRaw.length; i += 7)
        {
            var region = this.decodeRaw.substring(i, i + 7);
            region = Number.parseInt(region, 2);
            region = region.toString(10);
            regions.push(region);
        }
        regions = regions.reverse();
        this.decodeRaw = regions; //flip it around because we added new digits to the most significant side

        this.decodeResult = "";
        for(var character of this.decodeRaw)
        {
            this.decodeResult += String.fromCodePoint(character);
        }
        this.decodeResult = decodeURIComponent(this.decodeResult) //undo URI encoding!

        //return to main execution loop
        this.execution("DECODE_RESULT");
    }

    baseToBigInt(numberString, base) {
        let result = BigInt(0);
        for (let i = 0; i < numberString.length; i++) {
            console.log("parsing " + numberString[i]);
            let digit = BigInt(Number.parseInt(numberString[i],this.decodeBitDepth));
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

