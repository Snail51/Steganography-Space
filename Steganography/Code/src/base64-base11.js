//This class converts between Base64 and Base11 via BigInts and Binary Strings
export class x64x11
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
    static to64(base11str)
    {
        var baseten = x64x11.baseToBigInt(base11str, 11);
        var base64 = x64x11.bigTenToBase(baseten, 64);
        var safe =  x64x11.safe64(base64);
        return safe;
    }

    /**
     * The function `to11` converts a base64 string to a base11 string.
     * @param base64str - The parameter `base64str` is a string that represents a number encoded in
     * base64 format that has been made URI-safe.
     * @returns a string representation of the input base64 string converted to base11.
     */
    static to11(base64str)
    {
        var unsafe = x64x11.unsafe64(base64str);
        var baseten = x64x11.baseToBigInt(unsafe, 64);
        var base11 = x64x11.bigTenToBase(baseten, 11);
        return base11;
    }

    /**
     * The function `safe64` converts a base64 string with URL-safe characters to a regular base64
     * string.
     * @param unsafe64str - The parameter `unsafe64str` is a string that represents a base64 encoded
     * value that may contain characters that are not safe for use in URLs.
     * @returns the modified string after replacing all occurrences of "-" with "+" and "_" with "/".
     */
    static safe64(unsafe64str)
    {
        return unsafe64str.replace(/\-/g, '+').replace(/\_/g, '/');
    }

    /**
     * The function unsafe64 converts a safe base64 string to an unsafe base64 string by replacing '+'
     * with '-' and '/' with '_'.
     * @param safe64str - The parameter safe64str is a string that represents a base64 encoded value.
     * @returns a modified version of the input string `safe64str`. The function replaces all
     * occurrences of the `+` character with `-` and all occurrences of the `/` character with `_`.
     */
    static unsafe64(safe64str)
    {
        return safe64str.replace(/\+/g, '-').replace(/\//g, '_');
    }

    static baseToBigInt(numberString, base)
    {
        let result = BigInt(0);
        for (let i = 0; i < numberString.length; i++) {
            let digit = BigInt(x64x11.parseBase(numberString[i], base));
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
        if(base <= 64) //using base64 encoding
        {
            const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            return base64Chars.indexOf(char);
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
        if(base <= 64) //using base64 encoding
        {
            var order = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            while (num)
            {
                var r = num % BigInt(base);
                num = num / BigInt(base);
                str = order.charAt(Number(r)) + str;
            }
            return str;
        }
        console.warn("bigTenToBase failed with num \"" + num + "\" and base " + base);
        return null;
    }
}