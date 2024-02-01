class CoverLimitError extends Error {
    constructor(message) {
        this.message = (message === undefined) ? 
            "ERROR: Cover spaces have been exhausted!" : message;
        this.name = "CoverLimitError";
    }
}

//This class replaces space characters with variants in a text following a Base11 encoding scheme
export class Base11Sub
{
    constructor()
    {
        //decide what spaces will be used
        this.spaces = undefined;
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
            throw new CoverLimitError();
        }
        var result = cover;
        var idx = cover.indexOf(' ');

        for (const c in message) {
            let target_space_idx = Number.parseInt(c, 11);
            try {
                let chr = this.spaces[target_space_idx];
                result = result.substring(0,idx) + chr + result.substring(idx+1);
            } catch (error) {
                throw error;
            }
            idx = cover.indexOf(' ',idx+1);
        }
        return result;
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
        var t1 = string.filter((value) => this.spaces.indexOf(value) !== -1);
        // something else
    }

    /**
     * Compares a cover and the length of a message (which is being encoded by this.encode())
     * and first checks if the cover message is shorter than the message (return false);
     * else, counts the number of spaces in this message and returns whether or not it is >= message_len
     * @param message - The Base11 value (as string) that is to be encoded into the cover.
     * @param message_len - The (integer) size of
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