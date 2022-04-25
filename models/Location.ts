/**
 * @file Declares Location data type representing location of a user in terms of latitude and longitude
 * coordinates
 */

/**
 * @typedef Location Represents location of a user
 *
 * @property {number} latitude the latitude coordinate
 * @property {number} longitude the longitude coordinate
 */
export default class Location {
    public latitude: number = 0.0;
    public longitude: number = 0.0;
};
