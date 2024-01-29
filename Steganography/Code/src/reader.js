//This class provides a standard way to read in the content of files for processing
export class Reader
{
    constructor(inputElementID)
    {
        this.element = document.getElementById(inputElementID);
        this.value = null;
    }

    /**
     * The `readSingleAsBytes()` method is used to read the content of a single file linked
     * to this object as an array of bytes. It is typically used when dealing with binary files.
     * @result this.value will become populated (non-null) once read is complete.
     */
    readSingleAsBytes()
    {

    }

    /**
     * The `readSingleAsText()` method is used to read the content of a single file linked
     * to this object as text.
     * @result this.value will become populated (non-null) once read is complete.
     */
    readSingleAsText()
    {

    }

    /**
     * The `readMultipleAsBytes()` method is used to read the content of all files linked
     * to this object as an array of Byte arrays. It is typically used when dealing with binary files.
     * @result this.value will become populated (non-null) once read is complete.
     */
    readMultipleAsBytes()
    {

    }

    /**
     * The `readMultipleAsText()` method is used to read the content of all files linked
     * to this object as an array of Text arrays.
     * @result this.value will become populated (non-null) once read is complete.
     */
    readMultipleAsText()
    {

    }
}