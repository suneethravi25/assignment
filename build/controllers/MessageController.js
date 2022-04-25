"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageDao_1 = __importDefault(require("../daos/MessageDao"));
/**
 * @class MessageController Implements RESTful Web service API for messages resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid1/messages/:uid2 to create a new message instance </li>
 *     <li>GET /api/messages to get all messages. </li>
 *     <li>DELETE /api/messages/:mid to remove a particular message instance </li>
 *     <li>GET /api/users/:uid/messages/sent to retrieve all messages that a particular user has sent </li>
 *     <li>GET /api/users/:uid/messages/received to retrieve all messages that a particular user has received </li>
 * </ul>
 * @property {MessageDao} messageDao Singleton DAO implementing like CRUD operations
 * @property {MessageController} messageController Singleton controller implementing
 * RESTful Web service API
 */
class MessageController {
    constructor() {
        /**
         * Retrieves all message relations from the database
         * @param {Request} req Represents request from client.
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the message objects
         */
        this.findAllMessages = (req, res) => MessageController.messageDao.findAllMessages()
            .then((message) => res.json(message));
        /**
         * Retrieves all message relations from the database to retrieve messages that a particular user has received.
         * @param {Request} req Represents request from client, including path parameter uid representing the ID
         * of a user whose received messages are to be retrieved
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the message objects
         */
        this.findAllMessagesReceivedByUser = (req, res) => MessageController.messageDao.findAllMessagesReceivedByUser(req.params.uid)
            .then((messages) => res.json(messages));
        /**
         * Retrieves all message relations from the database to retrieve messages that a particular user has sent.
         * @param {Request} req Represents request from client, including path parameter uid representing the ID
         * of a user whose sent messages are to be retrieved
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the message objects
         */
        this.findAllMessagesSentByUser = (req, res) => MessageController.messageDao.findAllMessagesSentByUser(req.params.uid)
            .then((messages) => res.json(messages));
        /**
         * Removes a new message instance from the database
         * @param {Request} req Represents request from client, including path parameter mid
         * representing ID of message instance that needs to be removed from the database
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the message instance that is removed in the
         * database
         */
        this.userDeletesMessage = (req, res) => MessageController.messageDao.userDeletesMessage(req.params.mid)
            .then((status) => res.send(status));
        /**
         * Creates a new message instance
         * @param {Request} req Represents request from client, including body
         * containing the JSON object for the new message instance to be inserted in the
         * database
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the new message instance that was inserted in the
         * database
         */
        this.userSendsMessage = (req, res) => MessageController.messageDao.userSendsMessage(req.body)
            .then((message) => res.json(message));
    }
}
exports.default = MessageController;
MessageController.messageDao = MessageDao_1.default.getInstance();
MessageController.messageController = null;
/**
 * Creates singleton controller instance
 * @param {Express} app Express instance to declare the RESTful Web service
 * API
 * @return MessageController
 */
MessageController.getInstance = (app) => {
    if (MessageController.messageController === null) {
        MessageController.messageController = new MessageController();
        app.get("/api/messages", MessageController.messageController.findAllMessages);
        app.get("/api/users/:uid/messages/sent", MessageController.messageController.findAllMessagesSentByUser);
        app.get("/api/users/:uid/messages/received", MessageController.messageController.findAllMessagesReceivedByUser);
        app.post("/api/users/:uid1/messages/:uid2", MessageController.messageController.userSendsMessage);
        app.delete("/api/messages/:mid", MessageController.messageController.userDeletesMessage);
    }
    return MessageController.messageController;
};
