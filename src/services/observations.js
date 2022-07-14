const chartsService = require( './chart' );
const $ = require( 'jquery' );

/**
 * Creates a single timeseries from observation data
 *
 * @param { object } observations observation data of the feature
 * @param { date } startTime start time of observations
 * @param { date } endTime end time of observations
 */
 function sortObservations ( observations, startTime, endTime  ) {

    observations.sort( function ( a, b ) {
        return a.properties.day.localeCompare( b.properties.day );
    });

    let sortedObservations = [];

    let startDay = new Date( startTime.getFullYear(), startTime.getMonth(), startTime.getDate() );
    let endDay = new Date( endTime.getFullYear(), endTime.getMonth(), endTime.getDate() );

    for ( let i = 0, len = observations.length; i < len; i++ ) {

        let feature = observations[ i ].properties;

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
 * @param { Array<Object> } timeseries sorted timeseries containing the observations
 * @param { date } startTime start time of observations
 * @param { date } endTime end time of observations
 */
 function fixStartAndEndTimes( timeseries, startTime, endTime  ) {

    timeseries = fixStartTime( timeseries, startTime );
    timeseries = fixEndTime( timeseries, endTime );

    return timeseries;

}

/**
 * Removes observations from timeseries that are before the start time 
 *
 * @param { Array<Object> } timeseries sorted timeseries containing the observations
 * @param { date } startTime start time of observations
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
 * Removes observations from timeseries that are after the end time 
 *
 * @param { Array<Object> } timeseries sorted timeseries containing the observations∂
 * @param { date } endTime end time of observations
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
 * Generates table containing found observation results
 *
 * @param { object } featureData the data of the feature
 * @param { object } observationData possibile observation data of the feature
 * @param { number } requestStarted only used for measuring performance
 * @param { date } startTime start time of observations
 * @param { date } endTime end time of observations
 */
function generateTable ( featureData, observationData, requestStarted, startTime, endTime  ) {

    let sortedObservations = sortObservations( observationData, startTime, endTime  )

    console.log( 'timespent ', new Date( Date.now() ) - requestStarted, ' ms' );

    if ( sortedObservations.length ) {

        $( '#loadingicon' ).hide();
        chartsService.generateObservationChart( sortedObservations, featureData.getProperty( 'attributes' )[ 'Katuosoite' ] );

    }

}


module.exports = {
    generateTable
};