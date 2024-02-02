//This class converts between Base64 and Base11 via BigInts and Binary Strings
export class x2x8
{
    constructor()
    {
        //you shouldn't be instantiating this
    }

    static to2(base8str)
    {
        var base2 = "";
        //var debug = 0;
        for(var char of base8str)
        {
            var ten = Number.parseInt(char, 8);
            var binary = ten.toString(2);
            binary = binary.padStart(3, "0");
            //console.log(char, binary);
            base2 += binary;
            //console.log("to2 " + debug/base8str.length);
            //debug++;
        }
        let regex = /^0*1/;
        base2 = base2.replace(regex, "");
        return base2;
    }

    static to8(base2str)
    {
        var padcount = 3 - (base2str.length % 3);
        var padding = "0".repeat(padcount - 1) + "1"; //make sure to bad with 00000001 so we can find the end of the padding (like XYYY)
        var padded = padding + base2str;
        var base2arr = x2x8.splitIntoSizedSubstrings(padded, 3);
        var octal = "";
        //var debug = 0;
        for(var octet of base2arr)
        {
            var ten = Number.parseInt(octet, 2);
            octal += ten.toString(8);
            //console.log("to8 " + debug/base2arr.length);
            //debug++;
        }
        return octal;
    }

    static splitIntoSizedSubstrings(str, size)
    {
        let regex = new RegExp(".{1," + size + "}", "g");
        let substrings = str.match(regex);
        return substrings;
    }
}