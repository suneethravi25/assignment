/**
 * @file Defines mongoose schema for documents in the messages collection
 */
import mongoose, {Schema} from "mongoose";
import Message from "../models/Message";

const MessageSchema = new mongoose.Schema<Message>({
    message : String,
    sentBy : {type: Schema.Types.ObjectId, ref:"UserModel"},
    sentTo : {type: Schema.Types.ObjectId, ref:"UserModel"},
    sentOn : {type: Date, default: Date.now}
}, {collection:"messages"});

export default MessageSchema;