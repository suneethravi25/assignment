/**
 * @file Defines mongoose schema for documents in the dislikes collection
 */
import mongoose, {Schema} from "mongoose";
import Dislike from "../models/Dislike";

const DislikeSchema = new mongoose.Schema<Dislike>({
    tuit: {type: Schema.Types.ObjectId, ref: "TuitModel"},
    dislikedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "dislikes"});
export default DislikeSchema;