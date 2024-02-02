import { Reader } from "./reader.js";
import { URICompressor } from "./compression.js";
import { x2x8 } from "./base2-base8.js";
import { Provider } from "./provider.js";
import { Base8Sub } from "./base8-substituter.js";

export class Steganospace
{
    constructor()
    {
        this.messageReader = new Reader("message");
        this.coverReader = new Reader("cover");
        this.decodeReader = new Reader("ciphertext");
        this.encodeDownload = new Provider("encode_download");
        this.decodeDownload = new Provider("decode_download");
        this.converter = new x2x8();
        this.substitutor = new Base8Sub();

        //setInterval(function(){
        //    document.getElementById("progress").innerHTML = "Progress: " + String(this.converter.progress).substring(2,4) + "%";
        //}.bind(this),1000);
    }
    async encode()
    {
        //read the message file as binary from the reader
        var message = await this.messageReader.readSingleAsBinary();
        var size1 = Math.floor(message.data.length/8);

        //compress the binary (also to binary)
        message.data = URICompressor.compress(message.data);
        var size2 = Math.floor(message.data.length/8);
        console.log("Compression reduced file from " + size1 + " bytes to " + size2 + " bytes (" + size2/size1 + ")");
        
        //convert from binary (base 2) to octal (base8)
        message.data = this.converter.to8(message.data);

        //read the cover file as text from the reader
        var cover = await this.coverReader.readSingleAsText();

        //do the steganography
        var result = this.substitutor.encode(message.data, cover.data);

        //send the file to the webpage for downloading
        this.encodeDownload.provide(cover.name, cover.type, result);
    }
    async decode()
    {
        //read the ciphertext file as text
        var decode = await this.decodeReader.readSingleAsText();

        //undo the steganography
        decode.data = this.substitutor.decode(decode.data);

        //convert from octal (base8) to binary (base 2)
        decode.data = this.converter.to2(decode.data);

        //decompress the binary data
        decode.data = URICompressor.decompress(decode.data);
        console.log(decode.data);

        //pull out the metadata needeed to reconstitute itself
        var namelen = decode.data.substring(decode.data.length - 32, decode.data.length - 16) //grab the bytes [-4:-2]
        namelen = Number.parseInt(namelen, 2);
        var typelen = decode.data.substring(decode.data.length - 16, decode.data.length - 0) //grab the bytes [-1:-0]
        typelen = Number.parseInt(typelen, 2);
        var name = decode.data.substring(decode.data.length - 32 - (typelen*8)  - (namelen*8), decode.data.length - 32 - (typelen*8));
        name = binaryToString(name);
        name = decodeURIComponent(name);
        var type = decode.data.substring(decode.data.length - 32 - (typelen*8), decode.data.length - 32);
        type = binaryToString(type);
        type = decodeURIComponent(type);
        decode.data = decode.data.substring(0, decode.data.length - 32 - (namelen*8) - (typelen*8));
        decode.data = binaryToString(decode.data);
        console.log(name, type, decode.data);

        //send it the the window for download
        this.decodeDownload.provide(name, type, decode.data);

        function binaryToString(binary)
        {
            console.log(binary);
            var str = "";
            for(var i = 0; i < binary.length; i+=8)
            {
                var ten = Number.parseInt(binary.substring(i, i+8),2);
                str += String.fromCodePoint(ten);
            }
            return str;
        }
    }
}



            