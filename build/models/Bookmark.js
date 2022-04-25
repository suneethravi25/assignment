"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @typedef Bookmark Represents bookmarks relationship between a user and a tuit,
 * as in a user bookmarks a tuit
 * @property {Tuit} tuit Tuit being bookmarked
 * @property {User} bookmarkedBy User that bookmarks the tuit
 */
class Bookmark {
    constructor() {
        this.bookmarkedTuit = null;
        this.bookmarkedBy = null;
    }
}
exports.default = Bookmark;
;
