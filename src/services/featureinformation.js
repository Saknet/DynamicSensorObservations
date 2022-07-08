const chartsService = require( './chart' );
const $ = require( 'jquery' );

function sortByObservationTimes( s ) {
    var b = s.split(/\D+/);
    return new Date(b[2], b[1]-1, b[0]);
  }

/**
 * Generates tables containing feature information and if found observation results
 *
 * @param { object } featureData the data of the feature
 * @param { object } features possibile observation data of the feature
 * @param { number } requestStarted only used for measuring performance
 */
 function sortObservations ( features, startTime, endTime  ) {

    features.sort( function ( a, b ) {
        return a.properties.day.localeCompare( b.properties.day );
    });

    console.log("observationdata", features);

    let sortedObservations = [];

    let startDay = new Date( startTime.getFullYear(), startTime.getMonth(), startTime.getDate() );
    let endDay = new Date( endTime.getFullYear(), endTime.getMonth(), endTime.getDate() );

    console.log( "startDay", startDay );
    console.log( "endDay", endDay );


    for ( let i = 0, len = features.length; i < len; i++ ) {

        let feature = features[ i ].properties;


        const [ y, m, d ] = feature.day.split('-');

        let day = new Date( y, m - 1, d);

        if ( day >= startDay && day <= endDay ) {

            if ( sortedObservations.length ) {

                for ( let j = 0, len = feature.timeseries.length; j < len; j++ ) {

                    let timeseries = feature.timeseries[ j ];

                    console.log( "j", j );

                    for ( let k = 0, len = sortedObservations.length; k < len; k++ ) {

                        console.log( "k", k );

                        if ( timeseries.uom === sortedObservations[ k ].uom ) {
                            console.log( "sortedObservations", sortedObservations );


                            sortedObservations[ k ].sums = sortedObservations[ k ].sums.concat( timeseries.sums );

                            console.log( "sortedObservations", sortedObservations );

                            sortedObservations[ k ].averages = sortedObservations[ k ].averages.concat( timeseries.averages );
                            sortedObservations[ k ].observationtimes = sortedObservations[ k ].observationtimes.concat( timeseries.observationtimes );

                        }

                    }

                }

            } else {

                sortedObservations = features[ i ].properties.timeseries ;


            }

        }

        console.log("sortedObservations", sortedObservations);

    }

    return sortedObservations;

}


/**
 * Generates tables containing feature information and if found observation results
 *
 * @param { object } featureData the data of the feature
 * @param { object } observationData possibile observation data of the feature
 * @param { number } requestStarted only used for measuring performance
 */
function generateTables ( featureData, observationData, requestStarted, startTime, endTime  ) {

    console.log( "observationdata", observationData );

    let sortedObservations = sortObservations( observationData, startTime, endTime  )

    console.log( 'timespent ', new Date( Date.now() ) - requestStarted, ' ms' );

    if ( featureData ) {

        const filteredFeatureData = filterFeatureData( featureData );
        chartsService.generateFeatureDataTable( filteredFeatureData );

    }

    if ( sortedObservations.length ) {

        chartsService.generateObservationChart( sortedObservations, featureData.getProperty( 'attributes' )[ 'Katuosoite' ] );

    }

}

/**
 * Removes attributes that are no value to user
 *
 * @param { object } featureData the data of the feature
 * @return { Array<String> } kept attribute keys and values
 */
function filterFeatureData ( featureData ) {

    let keys = [];
    let values = [];

    if ( featureData.getProperty( 'attributes' ) ) {

        keys = Object.keys( featureData.getProperty( 'attributes' ) );
        values = Object.values( featureData.getProperty( 'attributes' ) );

    }

    let keysToKeep = [];
    let valuesToKeep = [];

    for ( let i = 0, len = keys.length; i < len; i++ ) {

        if ( values[ i ] && !keys[ i ].startsWith( 'Address' ) && keys[ i ] !== 'integrating_person' && keys[ i ] !== 'integration_date' && keys[ i ] !== 'matching_mode'
            && keys[ i ] !== 'externalReference externalObjectName' && keys[ i ] !== 'overlap_filter' && keys[ i ] !== 'overlap_file_to_DB' && keys[ i ] !== 'overlap_DB_to_file'
            && keys[ i ] !== 'area_diff_filter' && keys[ i ] !== 'area_diff' && keys[ i ] !== 'UUID' ) {
            keysToKeep.push( keys[ i ] );
            valuesToKeep.push( values[ i ] );
        }
    }

    $( '#loadingicon' ).hide();

    return [ keysToKeep, valuesToKeep ];
}

module.exports = {
    generateTables,
    filterFeatureData
};