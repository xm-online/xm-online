declare const google: any;

/**
 * Colored Pin builder for the Google Map.
 */
export const buildPinSymbol = (color) => {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 1,
        scale: 1,
        labelOrigin: new google.maps.Point(0, -29),
    };
};

/**
 * Unique id builder for the Google Map.
 */
export const buildMapId = (prefix?) => {
    return prefix + '_' + Math.random().toString(36).substr(2, 9);
};
