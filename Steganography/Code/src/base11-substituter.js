//This class replaces space characters with varients in a text following a Base11 encoding scheme
export class Base11Sub
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
                console.error("Invalid spaceType set in Base11Sub constructor");
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

    }

    /**
     * The "decode" identifies all this.spaces characters in the provided string and
     * reconstitutes a Base11 value (as string)
     * @param string - The string with substituted space characters from this.spaces
     * @return - Returns a Base11 value (as string) capturing the this.spaces information
     * @note - Trailing nulls are discarded
     */
    decode(string)
    {

    }
}