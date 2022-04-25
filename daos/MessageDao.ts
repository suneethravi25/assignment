/**
 * @file Implements DAO managing data storage of message relations. Uses mongoose MessageModel
 * to integrate with MongoDB
 */
import MessageDaoI from "../interfaces/MessageDaoI";
import Message from "../models/Message";
import MessageModel from "../mongoose/MessageModel";

/**
 * @class MessageDao Implements Data Access Object managing data storage of message relations
 * @implements {MessageDaoI} MessageDaoI Message Dao Interface
 * @property {MessageDao} messageDao Private single instance of MessageDao
 */
export default class MessageDao implements MessageDaoI {
    private static messageDao: MessageDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns MessageDao
     */
    public static getInstance = () : MessageDao => {
        if (MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }

    private constructor() {}


    /**
     * Uses MessageModel to retrieve all message documents from messages collection.
     * @returns Promise To be notified when message instances are retrieved from the database
     */
    findAllMessages = async () : Promise<Message[]> =>
        MessageModel.find();

    /**
     * Uses MessageModel to retrieve all message documents and eventually the messages that
     * a particular user has received from other users from the follows collection
     * @param {string} uid Primary key of the user whose received messages are to be retrieved
     * @returns Promise To be notified when message instances are retrieved from the database
     */
    findAllMessagesReceivedByUser = async (uid: string) : Promise<Message[]> =>
        MessageModel.find({sentTo:uid}).populate("sentBy").exec();

    /**
     * Uses MessageModel to retrieve all message documents and eventually the messages that
     * a particular user has sent to other users from the follows collection
     * @param {string} uid Primary key of the user whose sent messages are to be retrieved
     * @returns Promise To be notified when message instances are retrieved from the database
     */
    findAllMessagesSentByUser = async (uid: string) : Promise<Message[]> =>
        MessageModel.find({sentBy:uid}).populate("sentTo").exec();

    /**
     * Removes a message instance from the database
     * @param {string} mid ID of the message to be removed from the database
     * @returns Promise To be notified when message instance is removed from the database
     */
    userDeletesMessage = async (mid:string) : Promise<any> =>
        MessageModel.deleteOne({_id:mid});

    /**
     * Inserts a message instance into the database
     * @param {Message} message Instance to be inserted into the database
     * @returns Promise To be notified when message instance is inserted into the database
     */
    userSendsMessage = async (message: Message) : Promise<any> =>
        MessageModel.create({...message});
};