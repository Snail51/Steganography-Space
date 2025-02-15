import { Reader } from "./reader.js";
import { URICompressor } from "./compression.js";
import { x2x8 } from "./base2-base8.js";
import { Provider } from "./provider.js";
import { Base8Sub } from "./base8-substituter.js";

export class Steganospace
{
    constructor()
    {
        this.maxSize = 100 * 1024 * 1024; //100MB

        this.messageReader = new Reader("message");
        this.coverReader = new Reader("cover");
        this.decodeReader = new Reader("ciphertext");
        this.encodeDownload = new Provider("encode_download");
        this.decodeDownload = new Provider("decode_download");
        this.converter = new x2x8();
        this.substitutor = new Base8Sub();

        setInterval(function(){ //only allow the user to encode when files are given
            document.getElementById("encode_button").disabled = !this.encodeValidate();
        }.bind(this),100);

        setInterval(function(){ //only allow the user to decode when files are given
            var decoderFile = this.decodeReader.element.files;
            decoderFile = (decoderFile.length > 0);

            document.getElementById("decode_button").disabled = !this.decodeValidate();
        }.bind(this),100);
    }

    async encode()
    {
        //clear the sceen
        this.encodeDownload.clear();
        await this.sleep(1000);

        //read the message file as binary from the reader
        var message = await this.messageReader.readSingleAsBinary();
        var size1 = Math.floor(message.data.length/8);

        //compress the binary (also to binary)
        message.data = URICompressor.compress(message.data);
        if(message.data == null)
        {
            this.encodeDownload.error();
            await this.sleep(1000);
            return; //abort if compression failed
        }
        var size2 = Math.floor(message.data.length/8);
        console.log("Compression reduced file from " + size1 + " bytes to " + size2 + " bytes (" + size2/size1 + ")");
        
        //convert from binary (base 2) to octal (base8)
        message.data = this.converter.to8(message.data);

        //read the cover file as text from the reader
        var cover = await this.coverReader.readSingleAsText();

        //do the steganography
        var result = this.substitutor.encode(message.data, cover.data);
        if(result == null)
        {
            this.encodeDownload.error();
            await this.sleep(1000);
            return; //abort if cover is not large enough
        }

        //send the file to the webpage for downloading
        this.encodeDownload.provide(cover.name, cover.type, result);
    }

    async decode()
    {
        //clear the screen
        this.decodeDownload.clear();
        await this.sleep(1000);

        //read the ciphertext file as text
        var decode = await this.decodeReader.readSingleAsText();

        //undo the steganography
        decode.data = this.substitutor.decode(decode.data);

        //convert from octal (base8) to binary (base 2)
        decode.data = this.converter.to2(decode.data);
        if(decode.data == null)
        {
            this.decodeDownload.error();
            await this.sleep(1000);
            return; //abort if compression failed
        }

        //decompress the binary data
        decode.data = URICompressor.decompress(decode.data);
        if(decode.data == null)
        {
            this.decodeDownload.error();
            await this.sleep(1000);
            return; //abort if compression failed
        }

        //pull out the metadata needeed to reconstitute itself
        var namelen = decode.data.substring(decode.data.length - 32, decode.data.length - 16) //grab the bytes [-4:-2]
        namelen = Number.parseInt(namelen, 2);
        var typelen = decode.data.substring(decode.data.length - 16, decode.data.length - 0) //grab the bytes [-1:-0]
        typelen = Number.parseInt(typelen, 2);
        var name = decode.data.substring(decode.data.length - 32 - (typelen*8)  - (namelen*8), decode.data.length - 32 - (typelen*8));
        name = this.binaryToString(name);
        name = decodeURIComponent(name);
        var type = decode.data.substring(decode.data.length - 32 - (typelen*8), decode.data.length - 32);
        type = this.binaryToString(type);
        type = decodeURIComponent(type);
        decode.data = decode.data.substring(0, decode.data.length - 32 - (namelen*8) - (typelen*8));
        decode.data = this.binaryToU8(decode.data);

        //send it the the window for download
        this.decodeDownload.provide(name, type, decode.data);
    }

    binaryToString(binary)
    {
        var str = "";
        for(var i = 0; i < binary.length; i+=8)
        {
            var ten = Number.parseInt(binary.substring(i, i+8),2);
            str += String.fromCodePoint(ten);
        }
        return str;
    }

    binaryToU8(BinaryStr)
    {
        var data = URICompressor.splitIntoChunks(BinaryStr, 8);
        var holder = new Array();
        for(var byte of data)
        {
            holder.push(Number.parseInt(byte, 2));
        }
        var result = new Uint8Array(holder);
        //console.log("ResultantU8", result)
        return result;
    }

    sleep(ms = 0) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    encodeValidate()
    {
        try
        {
            //make sure uploads exist
            var messageExists = (this.messageReader.element.files.length == 1);
            var coverExists = (this.coverReader.element.files.length == 1);

            //make sure uploads aren't too large
            var messageSmall = (this.messageReader.element.files[0].size < this.maxSize);
            var coverSmall = (this.coverReader.element.files[0].size < this.maxSize);

            //make sure the cover is of type `text/plain`
            var coverText = (this.coverReader.element.files[0].type == "text/plain");

            // AND
            return (messageExists && messageSmall && coverExists && coverSmall && coverText);
        }
        catch
        {
            return false;
        }
    }

    decodeValidate()
    {
        try
        {
            //make sure uploads exist
            var cipherExists = (this.decodeReader.element.files.length == 1);

            //make sure uploads aren't too large
            var cipherSmall = (this.decodeReader.element.files[0].size < this.maxSize);

            //make sure the cipher is of type `text/plain`
            var cipherText = (this.decodeReader.element.files[0].type == "text/plain");

            // AND
            return(cipherExists && cipherSmall && cipherText);
        }
        catch
        {
            return false;
        }
    }
}



            