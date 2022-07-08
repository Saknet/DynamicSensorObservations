
/**
   * Sends post request to backend service to retrive timeserialzied sensor observation results for the feature
   *
   * @param { string } url url backend service
   * @param { date } startDate the start date of observations
   * @param { date } endDate  the end date of observations
   * @param { string } gmlid  cityGML id of the feature
   * @param { string } ratu  if feature is a building it has ratu
   * @param { number } latitude  GPS coordinates of the feature
   * @param { number } longitude  GPS coordinates of the feature
   * @return { object } data found
   */
async function findObservations ( url, startDate, endDate, gmlid, ratu, latitude, longitude ) {

    const response = await fetch( url, {

        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                start: startDate,
                end: endDate,
                gmlid: gmlid,
                ratu: ratu,
                latitude: latitude,
                longitude: longitude
            } )
    } );

    if ( !response.ok )  {

        let message = `An error has occured: ${ response.status }`;
        throw new Error( message );

    }

    const data = await response.json();

    return data;

}

module.exports = {
    findObservations
};