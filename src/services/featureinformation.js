const chartsService = require( './chart' );
const $ = require( 'jquery' );

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

    let sortedObservations = [];

    let startDay = new Date( startTime.getFullYear(), startTime.getMonth(), startTime.getDate() );
    let endDay = new Date( endTime.getFullYear(), endTime.getMonth(), endTime.getDate() );

    for ( let i = 0, len = features.length; i < len; i++ ) {

        let feature = features[ i ].properties;

        const [ y, m, d ] = feature.day.split('-');

        let day = new Date( y, m - 1, d);

        if ( day >= startDay && day <= endDay ) {

            if ( sortedObservations.length ) {

                for ( let j = 0, len = feature.timeseries.length; j < len; j++ ) {

                    let timeseries = feature.timeseries[ j ];

                    for ( let k = 0, len = sortedObservations.length; k < len; k++ ) {

                        if ( timeseries.uom === sortedObservations[ k ].uom ) {

                            sortedObservations[ k ].sums = sortedObservations[ k ].sums.concat( timeseries.sums );
                            sortedObservations[ k ].averages = sortedObservations[ k ].averages.concat( timeseries.averages );
                            sortedObservations[ k ].observationtimes = sortedObservations[ k ].observationtimes.concat( timeseries.observationtimes );

                        }

                    }

                }

            } else {

                sortedObservations = feature.timeseries;

            }

        }

    }

    return fixStartAndEndTimes( sortedObservations, startTime, endTime );

}

/**
 * Generates tables containing feature information and if found observation results
 *
 * @param { object } featureData the data of the feature
 * @param { object } features possibile observation data of the feature
 * @param { number } requestStarted only used for measuring performance
 */
 function fixStartAndEndTimes( timeseries, startTime, endTime  ) {

    timeseries = fixStartTime( timeseries, startTime );
    timeseries = fixEndTime( timeseries, endTime );

    return timeseries;

}

/**
 * Generates tables containing feature information and if found observation results
 *
 * @param { object } featureData the data of the feature
 * @param { object } features possibile observation data of the feature
 * @param { number } requestStarted only used for measuring performance
 */
 function fixStartTime( timeseries, startTime ) {

    for ( let i = 0, len = timeseries.length; i < len; i++ ) {


        for ( let j = 0, len = timeseries[ i ].observationtimes.length; j < len; j++ ) {
            const [ waste, time ] = timeseries[ i ].observationtimes[ j ].split(',');

            const [ hours, minutes, seconds ] = time.split(':');


            let datetime = new Date( startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), Number( hours ), Number( minutes ),  Number( seconds ) );
        
            if ( datetime >= startTime ) {

                timeseries[ i ].observationtimes = timeseries[ i ].observationtimes.slice( j );
                timeseries[ i ].sums = timeseries[ i ].sums.slice( j );
                timeseries[ i ].averages = timeseries[ i ].averages.slice( j );
                break;

            }


        }
    }


    return timeseries;

}

/**
 * Generates tables containing feature information and if found observation results
 *
 * @param { object } featureData the data of the feature
 * @param { object } features possibile observation data of the feature
 * @param { number } requestStarted only used for measuring performance
 */
 function fixEndTime( timeseries, endTime ) {

    for ( let i = 0, len = timeseries.length; i < len; i++ ) {


        for ( let j = timeseries[ i ].observationtimes.length - 1; j >= 0; j-- ) {
            const [ waste, time ] = timeseries[ i ].observationtimes[ j ].split(',');

            const [ hours, minutes, seconds ] = time.split(':');


            let datetime = new Date( endTime.getFullYear(), endTime.getMonth(), endTime.getDate(), Number( hours ), Number( minutes ),  Number( seconds ) );
        
            if ( datetime <= endTime ) {

                timeseries[ i ].observationtimes = timeseries[ i ].observationtimes.slice( 0, j + 1 );
                timeseries[ i ].sums = timeseries[ i ].sums.slice( 0, j + 1 );
                timeseries[ i ].averages = timeseries[ i ].averages.slice( 0, j + 1 );
                break;

            }


        }
    }


    return timeseries;

}


/**
 * Generates tables containing feature information and if found observation results
 *
 * @param { object } featureData the data of the feature
 * @param { object } observationData possibile observation data of the feature
 * @param { number } requestStarted only used for measuring performance
 */
function generateTables ( featureData, observationData, requestStarted, startTime, endTime  ) {

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