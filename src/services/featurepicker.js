const Cesium = require( 'cesium/Cesium' );
const apiController = require( '../controllers/api' );
const featureInformationService = require( './observations' );
const chartsService = require( './chart' );
const $ = require( 'jquery' );
const boundingbox = require( '../utils/boundingbox' );

var Pickers_3DTile_Activated = true;
var startTime = new Date( new Date().getFullYear(), 0, 1 );
var endTime = new Date( new Date().setDate( new Date().getDate() - 1 ) );
var feature = null;

/**
 * Updates times needed for retrieving observations data when user changes dates with datepicker.
 * 30 minutes is always added to start date and also to end date if it is over 30 min before current date.
 * This is needed for correctness of timeseries as observations are serialized for every one hour. If user has
 * feature picked when they change dates, fetchObservationData is called.
 *
 * @param { date } start the start date
 * @param { date } end the end date
 */
function updateTimesForObservations ( start, end ) {

    startTime = new Date( start.getTime() );
    endTime = new Date( end.getTime() );


    if ( feature ) {

        fetchObservationData();

    }
}

/**
 * Activates feature picker TODO: this is too long, refactor it..
 *
 * @param { object } viewer Cesium viewer
 */
function active3DTilePicker ( viewer ) {

    let highlighted = {

        feature: undefined,
        originalColor: new Cesium.Color()

    };
    // Information about the currently selected feature
    let selected = {

        feature: undefined,
        originalColor: new Cesium.Color()

    };

    // Get default left click handler for when a feature is not picked on left click
    let clickHandler = viewer.screenSpaceEventHandler.getInputAction( Cesium.ScreenSpaceEventType.LEFT_CLICK );
    // Color a feature green on hover.
    viewer.screenSpaceEventHandler.setInputAction( function onMouseMove ( movement ) {

        if ( Pickers_3DTile_Activated ) {
            // If a feature was previously highlighted, undo the highlight
            if ( Cesium.defined( highlighted.feature ) ) {
                highlighted.feature.color = highlighted.originalColor;
                highlighted.feature = undefined;
            }
            // Pick a new feature
            feature = viewer.scene.pick( movement.endPosition );
            if ( !Cesium.defined( feature ) ) {
                // nameOverlay.style.display = 'none';
                return;
            }

            // Highlight the feature if it's not already selected.
            if ( feature !== selected.feature ) {

                highlighted.feature = feature;
                Cesium.Color.clone( feature.color, highlighted.originalColor );
                feature.color = Cesium.Color.GREEN;
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE );

    // Color a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction( function onLeftClick ( movement ) {


        if ( Pickers_3DTile_Activated ) {

            // If a feature was previously selected, undo the highlight
            if ( Cesium.defined( selected.feature ) ) {
                selected.feature.color = selected.originalColor;
                selected.feature = undefined;
            }

            // Clear charts
            removeCharts();
            // Pick a new feature
            feature = viewer.scene.pick( movement.position );

            if ( !Cesium.defined( feature ) ) {
                clickHandler( movement );
                return;
            }

            // Select the feature if it's not already selected
            if ( selected.feature === feature ) {
                return;
            }

            selected.feature = feature;
            // Save the selected feature's original color
            if ( feature === highlighted.feature ) {

                Cesium.Color.clone( highlighted.originalColor, selected.originalColor );
                highlighted.feature = undefined;

            } else {

                Cesium.Color.clone( feature.color, selected.originalColor );

            }

            const llcoordinates = toDegrees( viewer.scene.pickPosition( movement.position ) );
            feature.latitude = llcoordinates[ 0 ];
            feature.longitude = llcoordinates[ 1 ];
            fetchObservationData( llcoordinates );

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK );

    viewer.screenSpaceEventHandler.setInputAction( function onRightClick () {

        // Clear charts
        removeCharts();

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK );

}

/**
 * Sends user selected time period and parameters found in feature to backend to feach observation data matching the search criteria
 * 
 * @param { Array<Number> } llcoordinates feature's gps coordinates
 */
async function fetchObservationData ( llcoordinates ) {

    let gmlid;
    let ratu;
    let latitude;
    let longitude;

    const attributes = feature.getProperty( 'attributes' );

    if ( attributes ) {

        gmlid = feature.getProperty( 'id' );
        latitude = llcoordinates[ 0 ];
        longitude = llcoordinates[ 1 ];
        ratu =  attributes[ 'Rakennustunnus_(RATU)' ];

        if ( !ratu ) {

            ratu = attributes[ 'ratu' ];

        }

    } else {

        latitude = feature.getProperty( 'latitude' ) ;
        longitude = feature.getProperty( 'longitude' );
        ratu =  feature.getProperty( 'Rakennustunnus_(RATU)' );

        if ( !ratu ) {

            ratu = feature.getProperty( 'ratu' );

        }

    }   

    const requestStarted = new Date( Date.now() );
    let savedFeature = feature;

    $( '#loadingicon' ).toggle();

    const bbox = boundingbox.createBoundingBoxForCoordinates( longitude, latitude  );

    apiController.getDataFromAPI( 'https://geo.fvh.fi/timeseries/collections/hki_sensor_observations/items?f=json&limit=366&bbox=' + bbox ).then(
        observationData => featureInformationService.generateTable( savedFeature, observationData.features, requestStarted, startTime, endTime ) ).catch(
        ( e ) => {

            console.log( 'something went wrong', e );
            console.log( 'timespent ', new Date( Date.now() ) - requestStarted, ' ms' );

        }
    );
}

/**
 * Resets feature and calls chartservice to purge all charts
 */
function removeCharts () {

    chartsService.purgeAllCharts();
    feature = null;

}

/**
 * Coverts feature's cartesian position to gps coordinates
 * 
 * @param { Object } cartesian3Pos feature's cartesian3Pos
 */
 function toDegrees( cartesian3Pos ) {

    let pos = Cesium.Cartographic.fromCartesian( cartesian3Pos );
    return [ pos.latitude / Math.PI * 180, pos.longitude / Math.PI * 180 ];

  }

module.exports = {
    updateTimesForObservations,
    active3DTilePicker
};