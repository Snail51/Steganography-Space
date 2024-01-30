//This Class acts as a wrapper for Pako.js, making sure text can be SAFELY conveted between raw and compressed Base64
export class URICompression
{
    constructor()
    {
        //you shouldnt be instantiating this
    }

    /**
     * The function compresses the given string to base64 representation via Pako.js.
     * @param str - The parameter "str" is a (UTF-32) string that represents the input that needs to be
     * compressed.
     * @return - Returns a compressed version of the data in base64
     * @note - Function takes care to properly encode the text to handle the U8Int limitations of pajo.js.
     */
    static compress(str)
    {

    }

    /**
     * The function decompresses a base64 encoded string.
     * @param base64str - The base64str parameter is a string that represents data encoded in base64
     * format.
     * @return - Returns the raw string (UTF-32) representation of the comressed data
     * @note - Preforms decodeURIcomponent-- result string must be assumed to be UTF-32
     */
    static decompress(base64str)
    {

    }
}