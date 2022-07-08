

/**
 * Sends get request to api specified in the url
 *
 * @param { string } url bounding box of things
 * @return { object } data found
 */
async function getDataFromAPI ( url ) {

    const response = await fetch( url );

    if ( !response.ok )  {

        let message = `An error has occured: ${ response.status }`;
        throw new Error( message );

    }

    const data = await response.json();

    return data;

}

module.exports = {
    getDataFromAPI
};