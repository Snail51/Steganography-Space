//This class provides a standard way to provide files to the user for download
export class Provider
{
    constructor(linkElementId)
    {
        this.element = document.getElementById(linkElementId);
        this.serve;
    }

    /**
     * Resets the link element and turns it into an inert state.
     * Also frees the memory of old URL provides.
     */
    clear()
    {

    }

    /**
     * Produces a blob with the given data, type, and name, and makes download of that blob
     * avilible at the link element bound to the class.
     * @param data - String or Bytes representing the file's data
     * @param type - The type parameter specifies the type of data that is being provided. EX: text/plain.
     * @param name - The default name the file will have for download.
     */
    provide(data, type, name)
    {

    }
}