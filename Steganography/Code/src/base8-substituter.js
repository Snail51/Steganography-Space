//This class replaces space characters with variants in a text following a Base11 encoding scheme
export class Base8Sub
{
    constructor()
    {
        //decide what spaces will be used
        this.spaces = "";
        this.spaceType = "BILLIARDS"; //SPACE, BILLIARDS


        switch(this.spaceType)
        {
            case "SPACE":
                this.spaces = "\u0020\u00A0\u2000\u2002\u2004\u2005\u2006\u2008\u2009\u202F\u205F";
                break;
            case "BILLIARDS":
                this.spaces = "⓪①②③④⑤⑥⑦⑧⑨Ⓐ";
                break;
            default:
                console.error("Invalid spaceType set in Base8Sub constructor");
                this.spaces = null;
                break;
        }
    }

    /**
     * The "encode" function replaces all spaces in the cover with the corresponding char
     * from this.spaces for the given Base11 digit in the given value.
     * @param message - The Base11 value (as string) that is to be encoded into the cover.
     * @param cover - The cryptographic medium that will have its spaces replaced to communicate the message.
     * @return - Returns a string where all spaces have been replaced with a variant based on the provided Base11 message.
     * @except - Program must abort if the cover is not large enough to hold the message.
     * @note - After the message has been exhausted, all remaning spaces are replaced with this.spaces[0].
     */
    encode(message, cover)
    {
        console.log(message.length);
        cover = normalizeSpaces(cover, this.spaces); // make sure all spaces we are parsing get set to type 0
        var count = countSpaces(cover, this.spaces);
        if(count <= message.length + 1) //tax of 2 (length is +1 plus and additional 1) needed for minimum XY(YYYY) pad
        {
            var warn = "Cover is not large enough. Trying to fit " + (message.length + 2) + " characters into " + count + " space (needs " + ((message.length+2) - count) + " more).";
            console.warn(warn);
            alert(warn);
            return null;
        }

        var ciphertext = "";
        for(var character of message)
        {
            var value = Number.parseInt(character, 8);
            ciphertext += this.spaces[value];
        }

        var regex = /(?<![ ])[ ](?![ ])/g;
        var index = 0;
        var pad = false;
        var newStr = cover.replace(regex, function(match)
        {
            var replacement = "";
            if(index >= ciphertext.length)
            {
                if(!pad)
                {
                    pad = true;
                    replacement = this.spaces[1];
                }
                else
                {
                    replacement = this.spaces[0];
                }
            }
            else
            {
                replacement = ciphertext[index];
                index++;
            }
            return replacement;
        }.bind(this));
        return newStr;

        function countSpaces(str, spaces)
        {
            const re = new RegExp(("(?<![ ])[ ](?![ ])"),"g");
            return ((str || '').match(re) || []).length;
        }
           
        function normalizeSpaces(str, spaces)
        {
            var regex = "[" + spaces + "]";
            var newStr = str.replace(new RegExp(regex, "g"), " ");
            return newStr;
        }
    }

    /**
     * The "decode" identifies all this.spaces characters in the provided string and
     * reconstitutes a Base11 value (as string)
     * @param encoded_msg - The string with substituted space characters from this.spaces
     * @return - Returns a Base11 value (as string) capturing the this.spaces information
     * @note - Trailing nulls are discarded
     */
    decode(encoded_msg)
    {
        var regex = "(?<![" + this.spaces + "])[" + this.spaces + "](?![" + this.spaces + "])";
        var result = "";
        var newStr = encoded_msg.replace(new RegExp(regex, "g"), function(match) {
            var ten = this.spaces.indexOf(match);
            var replacement = ten.toString(8);
            result += replacement;
            return replacement;
        }.bind(this));
        result = result.replace(/10*$/gm, "");
        return result;
    }
};