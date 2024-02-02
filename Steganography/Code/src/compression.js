import "./pako.js"
//This Class acts as a wrapper for Pako.js, making sure text can be SAFELY conveted between raw and compressed Base64
export class URICompressor
{
    constructor()
    {
        //you shouldnt be instantiating this
    }

    static compress(uncompressedBinary)
    {
        if(!URICompressor.isBinaryString(uncompressedBinary))
        {
            console.warn("could not compress string, not binary");
            return;
        }

        uncompressedBinary = URICompressor.BinaryToU8(uncompressedBinary);
        var cmprs = pako.deflate(uncompressedBinary, { level: 9});
        return URICompressor.U8toBinary(cmprs);
    }

    static decompress(compressedBinary)
    {
        if(!URICompressor.isBinaryString(compressedBinary))
        {
            console.warn("could not decompress string, not binary");
            return;
        }

        var u8 = URICompressor.BinaryToU8(compressedBinary);
        var dcmprs = pako.inflate(u8, { level: 9});
        return URICompressor.U8toBinary(dcmprs);
    }  

    static U8toBinary(Uint8Array)
    {
        var result = "";
        for(var ui8 of Uint8Array)
        {
            var byte = ui8.toString(2);
            byte = byte.padStart(8, "0");
            result += byte;
        }
        //console.log("ResultantBinary", result);
        return result;
    }

    static BinaryToU8(BinaryStr)
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

    static splitIntoChunks(str, size) 
    {
        var chunks = [];
        for (var i = 0; i < str.length; i += size) {
            chunks.push(str.slice(i, i + size));
        }
        return chunks;
    }

    static isBinaryString(str)
    {
        var isString = (typeof(str) == "string");
        var isMod8 = (0 == (str.length % 8));
        var isBinary = binaryOnly(str);
        return isString && isMod8 && isBinary;

        function binaryOnly(str)
        {
            var result = str.match(/[^01]/g); //does the string contain anything other than 1s and 0s?
            if(result == null)
            {
                result = "";
            }
            var mod8 = (0 == (str.length % 8)); //is the string%8==0 (Uint8array data)
            return (result.length == 0 && mod8);
        }
    }
}