import Message from "../models/Message";

export default interface MessageDaoI{
    userSendsMessage(message : Message) : Promise<any>;
    userDeletesMessage(mid:string) : Promise<any>;
    findAllMessagesSentByUser(uid:string) : Promise<Message[]>;
    findAllMessagesReceivedByUser(uid:string) : Promise<Message[]>;
    findAllMessages() : Promise<Message[]>;
};
