const apiController = require( '../controllers/api' );
const chartsService = require( './chart' );
const boundingbox = require( '../utils/boundingbox' );

/**
 * Displays all things with within feature
 *
 * @param { number } latitude  GPS coordinates of the feature
 * @param { number } longitude  GPS coordinates of the feature
 * @return { string } processed data
 */
 async function displayThingsWithinFeature ( longitude, latitude ) {

    const bbox = boundingbox.createBoundingBoxForCoordinates( longitude, latitude  );
    const thingsFromAPI = await apiController.getDataFromAPI( 'https://geo.fvh.fi/features/collections/thing/items?f=json&bbox=' + bbox );
    
    if ( thingsFromAPI.features.length ) {

        const processedThings = processThingData( thingsFromAPI );
        chartsService.generateThingTable( processedThings );

    }
    
}

/**
 * Processes thing data recieved from API for displaying it with plotly
 *
 * @param { number } latitude  GPS coordinates of the feature
 * @param { number } longitude  GPS coordinates of the feature
 * @return { string } processed data
 */
 function processThingData ( things ) {

    let names = [];
    let locations = [];
    let projects = []; 

    for ( let i = 0, len = things.features.length; i < len; i++ ) {

        if ( things.features[ i ].properties ) {
            names.push( things.features[ i ].properties.name ); 
            locations.push( things.features[ i ].properties.location.name ); 
            projects.push( things.features[ i ].properties.properties.Project ); 

        }           
    }

    return [ names, locations, projects ];

}

module.exports = {
    displayThingsWithinFeature
};