"use strict";
/**
 * @file Declares Location data type representing location of a user in terms of latitude and longitude
 * coordinates
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @typedef Location Represents location of a user
 *
 * @property {number} latitude the latitude coordinate
 * @property {number} longitude the longitude coordinate
 */
class Location {
    constructor() {
        this.latitude = 0.0;
        this.longitude = 0.0;
    }
}
exports.default = Location;
;
