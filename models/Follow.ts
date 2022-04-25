/**
 * @file Declares Follow data type representing relationship between
 * two users, as in a user follows another user
 */
import User from "./User";

/**
 * @typedef Follow Represents a follow relationship between two users,
 * as in a user follows another user
 * @property {User} userFollowing a user that is following
 * @property {User} userFollowed a user that is being followed
 * @property {Date} followedOn the date when the user follows another user
 */
export default class Follow {
    userFollowed: User | null = null;
    userFollowing: User | null = null;
    followingSince: Date | null = null;
};
