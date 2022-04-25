/**
 * @file Controller RESTful Web service API for follows resource
 */
import MessageControllerI from "../interfaces/MessageControllerI";
import MessageDao from "../daos/MessageDao";
import {Express, Request, Response} from "express";
import Message from "../models/Message";

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
export default class MessageController implements MessageControllerI {
    private static messageDao : MessageDao = MessageDao.getInstance();
    private static messageController : MessageController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return MessageController
     */
    public static getInstance = (app: Express) : MessageController => {
        if (MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.get("/api/messages", MessageController.messageController.findAllMessages);
            app.get("/api/users/:uid/messages/sent", MessageController.messageController.findAllMessagesSentByUser);
            app.get("/api/users/:uid/messages/received", MessageController.messageController.findAllMessagesReceivedByUser);
            app.post("/api/users/:uid1/messages/:uid2", MessageController.messageController.userSendsMessage);
            app.delete("/api/messages/:mid", MessageController.messageController.userDeletesMessage);

        }
        return MessageController.messageController;
    }

    private constructor() {}

    /**
     * Retrieves all message relations from the database
     * @param {Request} req Represents request from client.
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessages = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessages()
            .then((message : Message[]) => res.json(message));

    /**
     * Retrieves all message relations from the database to retrieve messages that a particular user has received.
     * @param {Request} req Represents request from client, including path parameter uid representing the ID
     * of a user whose received messages are to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessagesReceivedByUser = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesReceivedByUser(req.params.uid)
            .then((messages : Message[]) => res.json(messages));

    /**
     * Retrieves all message relations from the database to retrieve messages that a particular user has sent.
     * @param {Request} req Represents request from client, including path parameter uid representing the ID
     * of a user whose sent messages are to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessagesSentByUser = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesSentByUser(req.params.uid)
            .then((messages : Message[]) => res.json(messages));

    /**
     * Removes a new message instance from the database
     * @param {Request} req Represents request from client, including path parameter mid
     * representing ID of message instance that needs to be removed from the database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the message instance that is removed in the
     * database
     */
    userDeletesMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userDeletesMessage(req.params.mid)
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
    userSendsMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userSendsMessage(req.body)
            .then((message:Message) => res.json(message));
}