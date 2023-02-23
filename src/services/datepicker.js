const $ = require( 'jquery' );
const moment = require( 'moment' );
const daterangepicker = require( 'daterangepicker' );
const featurePickerService = require( '../services/featurepicker' );

/**
 * Initializes datepicker
 */
function initializeDatepicker () {

    let yesterday = new Date( new Date().setDate( new Date().getDate() - 1 ) );
    const currentYear = new Date().getFullYear();

    $( '#loadingicon' ).hide();

    /* jquery based daterangepicker function handling changing dates in UI */
    $( function () {
        $( 'input[name="datetimes"]' ).daterangepicker( {

            timePicker: true,
            startDate: new Date( currentYear - 1, 0, 1 ),
            endDate: yesterday,
            minDate: new Date( currentYear - 1, 0, 1 ),
            maxDate: yesterday,
            locale: {
                format: 'DD.M.Y HH:mm'
            }

        } );

        $( 'input[name="datetimes"]' ).on( 'apply.daterangepicker', function ( ev, picker ) {

            const startTime = picker.startDate._d;
            const endTime = picker.endDate._d;
            
            featurePickerService.updateTimesForObservations( startTime, endTime );


        } );

    } );

}

module.exports = {
    initializeDatepicker
};