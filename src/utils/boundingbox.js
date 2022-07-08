/**
 * Create bounding box for GPS coordinates of the feature
 *
 * @param { number } latitude  GPS coordinates of the feature
 * @param { number } longitude  GPS coordinates of the feature
 * @return { string } boundingbox of the feature
 */
 function createBoundingBoxForCoordinates ( longitude, latitude ) {

    const latmax = ( latitude + 0.0005 ).toString();
    const latmin = ( latitude  - 0.0005 ).toString();
    const longmax = ( longitude + 0.0005 ).toString();
    const longmin = ( longitude  - 0.0005) .toString(); 
    const bbox = longmin + ',' + latmin + ',' + longmax + ',' + latmax;

    return bbox;

}

module.exports = {
    createBoundingBoxForCoordinates
};