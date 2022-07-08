const Cesium = require( 'cesium/Cesium' );

// Public function for initializing the viewport
function initializeViewPort ( viewer, longitude, latitude ) {
    // Starting location, centered around Helsinki, in WGS84 degrees
    var west = 24.86;
    var south = 60.14;
    var east = 24.99;
    var north = 60.19;
    var rectangle = Cesium.Rectangle.fromDegrees( west, south, east, north );

    Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = rectangle;

    moveCameraTo( viewer, longitude, latitude );

    // Further shadow configuration
    viewer.shadowMap.enabled = true;
    viewer.shadowMap.darkness = 0.5;
    viewer.shadowMap.softShadows = false;
    viewer.shadowMap.size = 2048;

    // Rendering resolution configuration
    viewer.resolutionScale = 1;

}

// Moves camera to specified latitude, longitude coordinates
function moveCameraTo ( viewer, longitude, latitude ) {

    viewer.camera.setView( {
        destination: Cesium.Cartesian3.fromDegrees( longitude, latitude - 0.0065, 500.0 ),
        orientation: {
            heading: 0.0,
            pitch: Cesium.Math.toRadians( -35.0 ),
            roll: 0.0
        }
    } );

}

// This creates a box of six trim planes. However, at the moment it cannot take into account the differences in 3D-tiles coordinate systems.
function constructTrimBox ( tileset, minX, maxX, minY, maxY, minZ, maxZ, union, width ) {

    var planeVectorTop = new Cesium.Cartesian3( 0.0, -1.0, 0.0 );
    var planeVectorBottom = new Cesium.Cartesian3( 0.0, 1.0, 0.0 );
    var planeVectorLeft = new Cesium.Cartesian3( -1.0, 0.0, 0.0 );
    var planeVectorRight = new Cesium.Cartesian3( 1.0, 0.0, 0.0 );
    var planeVectorFloor = new Cesium.Cartesian3( 0.0, 0.0, -1.0 );
    var planeVectorRoof = new Cesium.Cartesian3( 0.0, 0.0, 1.0 );

    // Clipping plane paketti
    var clippingPlanes = new Cesium.ClippingPlaneCollection( {
        planes: [
            new Cesium.ClippingPlane( planeVectorTop, minY ),
            new Cesium.ClippingPlane( planeVectorBottom, maxY ),
            new Cesium.ClippingPlane( planeVectorLeft, minX ),
            new Cesium.ClippingPlane( planeVectorRight, maxX ),
            new Cesium.ClippingPlane( planeVectorFloor, minZ ),
            new Cesium.ClippingPlane( planeVectorRoof, maxZ )
        ]
    } );

    tileset.clippingPlanes = clippingPlanes;
    clippingPlanes.edgeWidth = width;

    // This switch is required for selectively creating holes or box-crops!
    clippingPlanes.unionClippingRegions = union;

}

module.exports = {
    initializeViewPort,
    moveCameraTo,
    constructTrimBox
};