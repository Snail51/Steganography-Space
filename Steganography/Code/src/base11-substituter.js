class CoverLimitError extends Error {
    constructor(message) {
        this.message = (message === undefined) ? 
            "ERROR: Insufficient cover limit!" : message;
        this.name = "CoverLimitError";
    }
}

//This class replaces space characters with variants in a text following a Base11 encoding scheme
export class Base11Sub
{
    #base11_chars = "0123456789A";
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
        if ( !this.#validate_cover(cover, message.length) ) {
            console.warn("ERROR: message length exceeds allowed cover size!");
            throw new CoverLimitError();
        }
        var result = cover;
        var cover_i = cover.indexOf(' ');
        for (var c of message) {
            let target_space_idx = parseInt(c.toString()); 
            if (target_space_idx === NaN) {
                continue;
            }
            let chr = this.spaces.at(target_space_idx);
            result = result.substring(0,cover_i) + chr + result.substring(cover_i+1);
            // Set to index of next space
            cover_i = cover.indexOf(' ',cover_i+1);
        }
        return result;
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
        const expr = /[this.spaces]/g;
        var spaces = encoded_msg.matchAll(expr);
        if (!spaces || spaces.length === 0) {
            throw "ERROR: No valid encoding characters in string!";
        }
        var result = "";
        for (let space in spaces) {
            let position = this.spaces.indexOf(space);
            let chr = this.#base11_chars.at(position);

            result += chr;
        }
        return result;
    }

    /**
     * Compares a cover and the length of a message (which is being encoded by this.encode())
     * by first checking if the cover message is shorter than the message (return false);
     * else, counts the number of spaces in this message and returns whether or not it is >= message_len
     * @param cover - The cover string.
     * @param message_len - The (integer) size of the message.
     * @return - Returns true if this is a valid cover given the length of the message, else false.
     */
    #validate_cover(cover, message_len) {
        if (cover.length < message_len) {
            return false;
        }
        let idx = cover.indexOf(' ');
        let num_spaces = 0;
        while (idx !== -1) {
            ++num_spaces;
            idx = cover.indexOf(' ', idx + 1);
        }
        return num_spaces >= message_len;
    }
};