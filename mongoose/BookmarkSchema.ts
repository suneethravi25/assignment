/**
 * @file Defines mongoose schema for documents in the bookmarks collection
 */
import mongoose, {Schema} from "mongoose";
import Bookmark from "../models/Bookmark";
import TuitModel from "./TuitModel";
import UserModel from "./UserModel";
const BookmarkSchema = new mongoose.Schema<Bookmark>({
    bookmarkedTuit: {type: Schema.Types.ObjectId, ref:'TuitModel'},
    bookmarkedBy: {type: Schema.Types.ObjectId, ref:'UserModel'}
}, {collection: "bookmarks"});
export default BookmarkSchema;