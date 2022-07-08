const Cesium = require( 'cesium/Cesium' );
const featurePickerService = require( '../services/featurepicker' );
const utils = require( '../utils/camera' );

/**
 * Initializes Cesium 
 */
 function initializeCesium () {

    let viewer = createViewr ();
    activateTileset( 24.976, 60.1845, 'https://kartta.hel.fi/3d/datasource-data/e9cfc1bb-a015-4a73-b741-7535504c61bb/tileset.json', viewer );
    return viewer;

}

/**
 * Creates Cesium viewer
 */
function createViewr () {

    Cesium.Ion.defaultAccessToken = null;
    let viewer = new Cesium.Viewer( 'cesiumContainer', {
        animation: false,
        fullscreenButton: false,
        geocoder: false,
        shadows: true,
        navigationHelpButton: false,
        timeline: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        homeButton: false,
        imageryProvider: new Cesium.WebMapServiceImageryProvider( {
            url : 'https://kartta.hel.fi/ws/geoserver/avoindata/ows?SERVICE=WMS&',
            layers : 'avoindata:Opaskartta_Helsinki_harmaa',
            proxy: new Cesium.DefaultProxy( '/proxy/' )
        } ),
        terrainProvider : new Cesium.EllipsoidTerrainProvider()
    } );

    return viewer;

}

/**
 * Loads tileset to viewer, calls functions that initialize camera and enable picking features
 *
 * @param { number } longitude GPS coordinates
 * @param { number } latitude GPS coordinates
 * @param { string } tileseturl url of tileset
 */
function activateTileset ( longitude, latitude, tileseturl, viewer ) {

    viewer.scene.primitives.add( new Cesium.Cesium3DTileset( {
        url: tileseturl,
        show: true,
        shadows: Cesium.ShadowMode.ENABLED,
        maximumScreenSpaceError: 4
    } ) );

    utils.initializeViewPort( viewer, longitude, latitude );


    featurePickerService.active3DTilePicker( viewer );

}

module.exports = {
    initializeCesium
};