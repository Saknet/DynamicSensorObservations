const utils = require( '../utils/camera' );
const districtselect = document.getElementById( 'district-select' );

/**
 * Initialize service
 * 
 * @param { object } viewer Cesium viewer
 * */
function initializeDistricts( viewer ) {

    addCityDistricts();
    activateSelect( viewer );

}

/**
 * Activates city district select
 * 
 * @param { object } viewer Cesium viewer
 * */
function activateSelect( viewer ) {

    districtselect.onchange = function () {

        for ( let i = 0; i < helsinkidistricts.length; i++ ) {

            if ( helsinkidistricts[ i ].name === districtselect.value ) {

                utils.moveCameraTo( viewer, helsinkidistricts[ i ].longitude, helsinkidistricts[ i ].latitude );
                break;

            }
        }
    };
}
/**
 * Loads city district names to select
 * */
function addCityDistricts () {

    for ( let i = 0; i < helsinkidistricts.length; i++ ) {

        let citydistrict = helsinkidistricts[ i ][ 'name' ];
        let el = document.createElement( 'option' );
        el.textContent = citydistrict;
        el.value = citydistrict;
        districtselect.appendChild( el );

        if ( citydistrict === 'Sörnäinen' ) {

            districtselect.options.selectedIndex = i;

        }
    }

}

/**
 * Hardcoded Helsinki city district's gps coordinates
 */
const helsinkidistricts = [
    {
        'name': 'Alppiharju',
        'latitude': 60.188333,
        'longitude': 24.945278
    },
    {
        'name': 'Eira',
        'latitude': 60.156609,
        'longitude': 24.937726
    },
    {
        'name': 'Etu-Töölö',
        'latitude': 60.172994,
        'longitude': 24.925180
    },
    {
        'name': 'Haaga',
        'latitude': 60.222507,
        'longitude': 24.893906
    },
    {
        'name': 'Hermanni',
        'latitude': 60.194585,
        'longitude': 24.969085
    },
    {
        'name': 'Herttoniemi',
        'latitude': 60.203376,
        'longitude': 25.045785
    },
    {
        'name': 'Kaarela',
        'latitude': 60.244128,
        'longitude': 24.883318
    },
    {
        'name': 'Kaartinkaupunki',
        'latitude': 60.165278,
        'longitude': 24.948889
    },
    {
        'name': 'Kaivopuisto',
        'latitude': 60.157657,
        'longitude': 24.956812
    },
    {
        'name': 'Kallio',
        'latitude': 60.184167,
        'longitude': 24.949167
    },
    {
        'name': 'Kamppi',
        'latitude': 60.166208,
        'longitude': 24.931281
    },
    {
        'name': 'Karhusaari',
        'latitude': 60.251043,
        'longitude': 25.224064
    },
    {
        'name': 'Katajanokka',
        'latitude': 60.166944,
        'longitude': 24.968333
    },
    {
        'name': 'Kluuvi',
        'latitude': 60.171066,
        'longitude': 24.943927
    },
    {
        'name': 'Konala',
        'latitude': 60.237214,
        'longitude': 24.847071
    },
    {
        'name': 'Koskela',
        'latitude': 60.218854,
        'longitude': 24.966792
    },
    {
        'name': 'Kruununhaka',
        'latitude': 60.172375,
        'longitude': 24.956111
    },
    {
        'name': 'Kulosaari',
        'latitude': 60.186667,
        'longitude': 25.008333
    },
    {
        'name': 'Kumpula',
        'latitude': 60.208506,
        'longitude': 24.961355
    },
    {
        'name': 'Käpylä',
        'latitude': 60.214511,
        'longitude': 24.950115
    },
    {
        'name': 'Laajasalo',
        'latitude': 60.171770,
        'longitude': 25.049241
    },
    {
        'name': 'Laakso',
        'latitude': 60.193981,
        'longitude': 24.911736
    },
    {
        'name': 'Lauttasaari',
        'latitude': 60.158611,
        'longitude': 24.875000
    },
    {
        'name': 'Länsisatama',
        'latitude': 60.157118,
        'longitude': 24.914435
    },
    {
        'name': 'Malmi',
        'latitude': 60.246594,
        'longitude': 25.024329
    },
    {
        'name': 'Mellunkylä',
        'latitude': 60.237486,
        'longitude': 25.094865
    },
    {
        'name': 'Munkkiniemi',
        'latitude': 60.200366,
        'longitude': 24.870122
    },
    {
        'name': 'Mustikkamaa-Korkeasaari',
        'latitude': 60.178627,
        'longitude': 24.990699
    },
    {
        'name': 'Oulunkylä',
        'latitude': 60.229051,
        'longitude': 24.945201
    },
    {
        'name': 'Pakila',
        'latitude': 60.243816,
        'longitude': 24.947491
    },
    {
        'name': 'Pasila',
        'latitude': 60.205530,
        'longitude': 24.926281
    },
    {
        'name': 'Pitäjänmäki',
        'latitude': 60.223299,
        'longitude': 24.859470
    },
    {
        'name': 'Pukinmäki',
        'latitude': 60.245576,
        'longitude': 24.989127
    },
    {
        'name': 'Punavuori',
        'latitude': 60.161641,
        'longitude': 24.937014
    },
    {
        'name': 'Ruskeasuo',
        'latitude': 60.202038,
        'longitude': 24.899456
    },
    {
        'name': 'Salmenkallio',
        'latitude': 60.241269,
        'longitude': 25.161544
    },
    {
        'name': 'Santahamina',
        'latitude': 60.146667,
        'longitude': 25.050000
    },
    {
        'name': 'Suomenlinna',
        'latitude': 60.145169,
        'longitude': 24.986060
    },
    {
        'name': 'Suurmetsä',
        'latitude': 60.267018,
        'longitude': 25.063187
    },
    {
        'name': 'Suutarila',
        'latitude': 60.275323,
        'longitude': 25.008307
    },
    {
        'name': 'Sörnäinen',
        'latitude': 60.186014,
        'longitude': 24.972713
    },
    {
        'name': 'Taka-Töölö',
        'latitude': 60.183796,
        'longitude': 24.919815
    },
    {
        'name': 'Talosaari',
        'latitude': 60.241620,
        'longitude': 25.197727
    },
    {
        'name': 'Tammisalo',
        'latitude': 60.191367,
        'longitude': 25.063854
    },
    {
        'name': 'Tapaninkylä',
        'latitude': 60.263341,
        'longitude': 25.004893
    },
    {
        'name': 'Toukola',
        'latitude': 60.208613,
        'longitude': 24.975037
    },
    {
        'name': 'Tuomarinkylä‎',
        'latitude': 60.260570,
        'longitude': 24.944833
    },
    {
        'name': 'Ullanlinna',
        'latitude': 60.159122,
        'longitude': 24.947763,
    },
    {
        'name': 'Ultuna',
        'latitude': 60.271592,
        'longitude': 25.200634,
    },
    {
        'name': 'Vallila',
        'latitude': 60.194444,
        'longitude': 24.956667,
    },
    {
        'name': 'Vanhakaupunki',
        'latitude': 60.215253,
        'longitude': 24.977997,
    },
    {
        'name': 'Vartiokylä',
        'latitude': 60.214978,
        'longitude': 25.089296,
    },
    {
        'name': 'Vartiosaari',
        'latitude': 60.184689,
        'longitude': 25.077688,
    },
    {
        'name': 'Viikki',
        'latitude': 60.224638,
        'longitude': 25.015753,
    },
    {
        'name': 'Villinki',
        'latitude': 60.158333,
        'longitude': 25.113333,
    },
    {
        'name': 'Vuosaari',
        'latitude': 60.209552,
        'longitude': 25.142679
    },
    {
        'name': 'Östersundom',
        'latitude': 60.255243,
        'longitude': 25.181796
    }
];

module.exports = {
    initializeDistricts
};