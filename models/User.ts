/**
 * @file Declares User data type representing a tuiter user. A user can perform various operations
 * that includes posting a tuit, like it, bookmark it, follow another user, and
 * message another user.
 */

import AccountType from "./AccountType";
import MaritalStatus from "./MaritalStatus";
import Location from "./Location";

/**
 * @typedef User Represents a tuiter user
 *
 * @property {string} username username of the user
 * @property {string} password password of the user
 * @property {string} firstName first name of the user
 * @property {string} lastName last name of the user
 * @property {string} email email id that the user used to create tuiter account
 * @property {string} profilePhoto profile photo resource of the user
 * @property {string} headerImage header image resource of the user
 * @property {AccountType} accountType a enum representing the type of a user's account based on its visibility
 * @property {MaritalStatus} maritalStatus the marital status of the user
 * @property {string} biography a short biography of the user
 * @property {Date} dateOfBirth date of birth of the user
 * @property {Date} joinedOn the date when the user created its account on tuiter
 * @property {Location} location location of the user
 */
export default interface User {
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePhoto: string,
    headerImage: string,
    accountType: AccountType,
    maritalStatus: MaritalStatus,
    biography: string,
    dateOfBirth: Date,
    joined: Date,
    location: Location,
}

