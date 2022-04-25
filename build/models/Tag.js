"use strict";
/**
 * @file Declares Tag data type representing a category of tuits as defined by the author of a tuit.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @typedef Tag Represents a category of tuits as defined by the author of the tuit.
 * @property {string} tag the tag that a tuit belongs to.
 */
class Tag {
    constructor() {
        this.tag = "";
    }
}
exports.default = Tag;
