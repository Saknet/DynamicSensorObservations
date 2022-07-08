const addressResult = document.getElementById( 'searchresults' );
const searchresultscontainer = document.getElementById( 'searchresultscontainer' );
const searchField = document.getElementById( 'searchInput' );
const searchButton = document.getElementById( 'searchButton' );
const clearButton = document.getElementById( 'clearButton' );
const apiController = require( '../controllers/api' );
const utils = require( '../utils/camera' );
let viewer;
let addressData = null;


/**
 * Initialize service
 * 
 * @param { object } v Cesium viewer
 */
 function initializeGeocoding( v ) {
    
    viewer = v;
    addEventListeners();

}


/**
 * Adds event listeners for user interactions
 */
 function addEventListeners () {

    searchButton.addEventListener( 'click', checkSearch );
    clearButton.addEventListener( 'click', clearSearch );
    searchField.addEventListener( 'keyup', filterSearchResults );
    addressResult.addEventListener( 'click', moveCameraToLocation );

}

/**
 * Processes the data found with geocoding API. Only results from Helsinki are included and only data useful for app is left in
 *
 * @param { object } data found data
 * @return { object } processed data
 */
function processAddressData ( data ) {

    let features = [];

    for ( let i = 0, len = data.length; i < len; i++ ) {

        // only include results from Helsinki
        if ( data[ i ][ 'properties' ][ 'locality' ] === 'Helsinki' || data[ i ][ 'properties' ][ 'localadmin' ] === 'Helsinki' ) {

            let row = { address: data[ i ][ 'properties' ][ 'name' ], latitude: data[ i ][ 'geometry' ][ 'coordinates'][ 1 ], longitude: data[ i ][ 'geometry' ][ 'coordinates'][ 0 ] };
            features.push( row );

        }


    }

    return features;

}

/**
 * Checks if there is only one value in searchresults and moves camera to the location
 */
function checkSearch () {

    if ( addressData.length === 1 ) {

        utils.moveCameraTo( viewer, addressData[ 0 ].longitude, addressData[ 0 ].latitude );
        document.getElementById( 'searchresults' ).innerHTML = '';

    }
}

/**
 * Clears search result container in UI
 */
function clearSearch () {

    searchresultscontainer.style.display = 'none';
    document.getElementById( 'searchInput' ).value = '';
    addressData = null;

}

/**
 * Function that filters search results
 */
async function filterSearchResults () {

    searchresultscontainer.style.display = 'none';

    if ( searchField.value.length > 2 ) {

        let data = await apiController.getDataFromAPI( 'https://api.digitransit.fi/geocoding/v1/autocomplete?text=' + searchField.value );

        if ( data ) {

            addressData = processAddressData( data[ 'features' ] );
            let streetAddresses = addressData.map( d => d.address );
            renderSearchResult( streetAddresses );

        }

    }

}

/**
 * Renders autocomplete search result
 *
 * @param { Array<String> } addresses shown to user
 */
function renderSearchResult ( addresses ) {

    let liElemet = '' ;

    for ( let i = 0; i < addresses.length; i++ ) {

        liElemet += `<dt>${ addresses[ i ] }</dt>`;

    }
    searchresultscontainer.style.display = 'block';
    document.getElementById( 'searchresults' ).innerHTML = liElemet;

}

/**
  * Finds coordinates for street address / search term and moves camera to the found coordinates
  *
  * @param { object } e event object from UI
  */
function moveCameraToLocation ( e ) {

    let lat;
    let long;

    e = e || window.event;
    let target = e.target || e.srcElement;
    let text = target.textContent || target.innerText;

    for ( let i = 0; i < addressData.length; i++ ) {

        if ( addressData[ i ].address === text ) {

            lat = addressData[ i ].latitude;
            long = addressData[ i ].longitude;
            break;

        }
    }

    utils.moveCameraTo( viewer, long, lat );
    document.getElementById( 'searchresults' ).innerHTML = '';
    document.getElementById( 'searchInput' ).value = text;
}

module.exports = {
    initializeGeocoding
};