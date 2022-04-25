/**
 * @file Declares Message data type representing relationship between two users,
 * as in a user messages another user.
 */
import User from "./User";

/**
 * @typedef Message Represents a message relationship between two users,
 * a user messages another user.
 * @property {string} message the message content being sent.
 * @property {User} sentBy User that sends the message.
 * @property {User} sentTo User that receives the message.
 * @property {Date} sentOn the date when the message was sent.
 */
export default class Message{
    message : string | null =  null;
    sentBy : User | null = null;
    sentTo: User | null = null;
    sentOn : Date | null = null;
};