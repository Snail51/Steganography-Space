//This class converts between Base64 and Base11 via BigInts and Binary Strings
export class x2x11
{
    constructor()
    {
        //you shouldn't be instantiating this
    }

    /**
     * The function takes a base 11 string, converts it to base 10, then converts it to base 64 and
     * returns a URI-safe version of the base 64 string.
     * @param base11str - The parameter `base11str` is a string representing a number in base 11.
     * @returns a safe base64 representation of the input base11 string.
     */
    static to2(base11str)
    {
        var baseten = x2x11.baseToBigInt(base11str, 11);
        var base2 = x2x11.bigTenToBase(baseten, 2);
        return base2;
    }

    /**
     * The function `to11` converts a base64 string to a base11 string.
     * @param base64str - The parameter `base64str` is a string that represents a number encoded in
     * base64 format that has been made URI-safe.
     * @returns a string representation of the input base64 string converted to base11.
     */
    static to11(base2str)
    {
        var baseten = x2x11.baseToBigInt(base2str, 2);
        var base11 = x2x11.bigTenToBase(baseten, 11);
        return base11;
    }

    static baseToBigInt(numberString, base)
    {
        let result = BigInt(0);
        for (let i = 0; i < numberString.length; i++) {
            let digit = BigInt(x2x11.parseBase(numberString[i], base));
            result += digit * BigInt(base) ** BigInt(numberString.length - i - 1);
        }
        return result;
    }

    /**
     * The function `parseBase` takes a character and a base as input and returns the parsed value of
     * the character based on the given base in base 10.
     * @param char - The character that needs to be parsed.
     * @param base - The base parameter represents the numerical base in which the character should be
     * parsed. It determines the range of valid digits for the character. If the base <= 36, standard
     * Number.parse() is used. If > 36, base64 encoding is used.
     * @returns The function `parseBase` returns the parsed value of the character `char` in the
     * specified `base`. If the `base` is less than or equal to 36, it uses `Number.parseInt` to parse
     * the character. If the `base` is between 37 and 64 (inclusive), it uses base64 encoding to parse
     * the character.
     */
    static parseBase(char, base)
    {
        if(base <= 36) //handle normally
        {
            return Number.parseInt(char, base);
        }
        console.warn("parseBase failed with char \"" + char + "\" and base " + base);
        return null;
    }

    /**
     * The function `bigTenToBase` converts a given BigInt from base 10 to a specified base, handling
     * bases <= 36 with standard number.toString() encoding and  bases 37-64 (inclusive) with 
     * base64 encoding.
     * @param num - The BigInt that you want to convert to a different base.
     * @param base - The "base" parameter represents the base to which the number should be converted.
     * It can be any integer value 2-64.
     * @returns The function `bigTenToBase` returns the converted number as a string in the specified
     * base.
     */
    static bigTenToBase(num, base) 
    {
        if(base <= 36) //handle normally
        {
            return num.toString(base);
        }
        console.warn("bigTenToBase failed with num \"" + num + "\" and base " + base);
        return null;
    }


}