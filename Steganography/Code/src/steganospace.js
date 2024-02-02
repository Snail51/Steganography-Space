import { Reader } from "./reader.js";
import { URICompressor } from "./compression.js";
import { x2x8 } from "./base2-base8.js";
import { Provider } from "./provider.js";
import { Base8Sub } from "./base8-substituter.js";

export class Steganospace
{
    constructor()
    {
        this.reader = new Reader("source");
        this.downloader = new Provider("download");
        this.converter = new x2x8();
        this.substitutor = new Base8Sub();

        setInterval(function(){
            document.getElementById("progress").innerHTML = "Progress: " + String(this.converter.progress).substring(2,4) + "%";
        }.bind(this),1000);
    }
    encode()
    {
        var result = this.substitutor.encode(document.getElementById("message").value, document.getElementById("cover").value);
        document.getElementById("encode_result").innerHTML = result;
    }
    decode()
    {
        var result = this.substitutor.decode(document.getElementById("ciphertext").value);
        document.getElementById("decode_result").innerHTML = result;
    }
    async read()
    {
        //read the file as binary from the reader
        var file = await this.reader.readSingleAsBinary();
        var size1 = Math.floor(file.data.length/8);

        //compress the binary (also to binary)
        file.data = URICompressor.compress(file.data);
        var size2 = Math.floor(file.data.length/8);
        console.log("Compression reduced file from " + size1 + " bytes to " + size2 + " bytes (" + size2/size1 + ")");
        
        //convert from binary (base 2) to octal (base8)
        file.data = this.converter.to8(file.data);
        document.getElementById("display").innerHTML = JSON.stringify(file);
        this.payload = file;
    }
    download()
    {
        //collect the compressed binary data from the this's payload
        var file = this.payload;
                
        //convert from octal (base 8) to binary (base 2)
        file.data = this.converter.to2(file.data);

        //decompress the binary (also to binary)
        file.data = URICompressor.decompress(file.data);

        document.getElementById("display").innerHTML = "";

        this.downloader.clear();
        var name = file.name;
        var type = file.type;
        var data = URICompressor.BinaryToU8(file.data);
        this.downloader.provide(name, type, data);
    }
}



            