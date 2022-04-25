"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @typedef Message Represents a message relationship between two users,
 * a user messages another user.
 * @property {string} message the message content being sent.
 * @property {User} sentBy User that sends the message.
 * @property {User} sentTo User that receives the message.
 * @property {Date} sentOn the date when the message was sent.
 */
class Message {
    constructor() {
        this.message = null;
        this.sentBy = null;
        this.sentTo = null;
        this.sentOn = null;
    }
}
exports.default = Message;
;
