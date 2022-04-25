"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageModel_1 = __importDefault(require("../mongoose/MessageModel"));
/**
 * @class MessageDao Implements Data Access Object managing data storage of message relations
 * @implements {MessageDaoI} MessageDaoI Message Dao Interface
 * @property {MessageDao} messageDao Private single instance of MessageDao
 */
class MessageDao {
    constructor() {
        /**
         * Uses MessageModel to retrieve all message documents from messages collection.
         * @returns Promise To be notified when message instances are retrieved from the database
         */
        this.findAllMessages = () => __awaiter(this, void 0, void 0, function* () { return MessageModel_1.default.find(); });
        /**
         * Uses MessageModel to retrieve all message documents and eventually the messages that
         * a particular user has received from other users from the follows collection
         * @param {string} uid Primary key of the user whose received messages are to be retrieved
         * @returns Promise To be notified when message instances are retrieved from the database
         */
        this.findAllMessagesReceivedByUser = (uid) => __awaiter(this, void 0, void 0, function* () { return MessageModel_1.default.find({ sentTo: uid }).populate("sentBy").exec(); });
        /**
         * Uses MessageModel to retrieve all message documents and eventually the messages that
         * a particular user has sent to other users from the follows collection
         * @param {string} uid Primary key of the user whose sent messages are to be retrieved
         * @returns Promise To be notified when message instances are retrieved from the database
         */
        this.findAllMessagesSentByUser = (uid) => __awaiter(this, void 0, void 0, function* () { return MessageModel_1.default.find({ sentBy: uid }).populate("sentTo").exec(); });
        /**
         * Removes a message instance from the database
         * @param {string} mid ID of the message to be removed from the database
         * @returns Promise To be notified when message instance is removed from the database
         */
        this.userDeletesMessage = (mid) => __awaiter(this, void 0, void 0, function* () { return MessageModel_1.default.deleteOne({ _id: mid }); });
        /**
         * Inserts a message instance into the database
         * @param {Message} message Instance to be inserted into the database
         * @returns Promise To be notified when message instance is inserted into the database
         */
        this.userSendsMessage = (message) => __awaiter(this, void 0, void 0, function* () { return MessageModel_1.default.create(Object.assign({}, message)); });
    }
}
exports.default = MessageDao;
MessageDao.messageDao = null;
/**
 * Creates singleton DAO instance
 * @returns MessageDao
 */
MessageDao.getInstance = () => {
    if (MessageDao.messageDao === null) {
        MessageDao.messageDao = new MessageDao();
    }
    return MessageDao.messageDao;
};
;
