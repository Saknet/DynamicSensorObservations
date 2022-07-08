require( './css/main.css' );
require( 'cesium/Widgets/widgets.css' );
require( 'bootstrap/dist/css/bootstrap.min.css' );

const geocodingService = require( './services/geocoding' );
const cesiumviewerService = require( './services/cesiumviewer' );
const districtService = require( './services/district' );
const datepickerService = require( './services/datepicker' );

let viewer = cesiumviewerService.initializeCesium();
datepickerService.initializeDatepicker();
districtService.initializeDistricts( viewer );
geocodingService.initializeGeocoding( viewer );