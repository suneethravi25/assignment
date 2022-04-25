"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @typedef Follow Represents a follow relationship between two users,
 * as in a user follows another user
 * @property {User} userFollowing a user that is following
 * @property {User} userFollowed a user that is being followed
 * @property {Date} followedOn the date when the user follows another user
 */
class Follow {
    constructor() {
        this.userFollowed = null;
        this.userFollowing = null;
        this.followingSince = null;
    }
}
exports.default = Follow;
;
