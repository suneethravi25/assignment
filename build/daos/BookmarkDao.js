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
const BookmarkModel_1 = __importDefault(require("../mongoose/BookmarkModel"));
/**
 * Implements Data Access Object managing data storage
 * of Bookmarks
 * @implements {BookmarkDaoI} BookmarkDaoI
 * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
 */
class BookmarkDao {
    constructor() {
        /**
         * Inserts bookmark instance into the database
         * @param {string} userId Primary key of the user that bookmarks the tuit
         * @param {string} tuitId Primary key of the tuit that is bookmarked by the user
         * @returns Promise To be notified when bookmark instance is inserted into the database
         */
        this.userBookmarksTuit = (tuitId, userId) => __awaiter(this, void 0, void 0, function* () { return BookmarkModel_1.default.create({ bookmarkedTuit: tuitId, bookmarkedBy: userId }); });
        /**
         * Removes a bookmark instance from the database.
         * @param {string} userId Primary key of user that unbookmarks the tuit
         * @param {string} tuitId Primary key of tuit being unbookmarked
         * @returns Promise To be notified when the bookmark instance is removed from the database
         */
        this.userUnbookmarksTuit = (tuitId, userId) => __awaiter(this, void 0, void 0, function* () { return BookmarkModel_1.default.deleteOne({ bookmarkedTuit: tuitId, bookmarkedBy: userId }); });
        /**
         * Uses BookmarkModel to retrieve all bookmark documents and eventually the tuits that are bookmarked by
         * a particular user from the bookmarks collection
         * @param {string} userId Primary key of the user
         * @returns Promise To be notified when bookmark instances are retrieved from the database
         */
        this.findAllTuitsBookmarkedByUser = (userId) => __awaiter(this, void 0, void 0, function* () { return BookmarkModel_1.default.find({ bookmarkedBy: userId }).populate("bookmarkedTuit").exec(); });
        /**
         * Uses BookmarkModel to retrieve all bookmark documents and eventually the users that bookmarked a
         * particular tuit from the bookmarks collection
         * @param {string} tuitId Primary key of the tuit
         * @returns Promise To be notified when bookmark instances are retrieved from the database
         */
        this.findAllUsersWhoBookmarkedTuit = (tuitId) => __awaiter(this, void 0, void 0, function* () { return BookmarkModel_1.default.find({ bookmarkedTuit: tuitId }).populate("bookmarkedBy").exec(); });
        /**
         * Finds all tuits that are bookmarked.
         * @returns Promise To be notified when bookmark instances are retrieved from the database
         */
        this.findAllBookmarkedTuits = () => __awaiter(this, void 0, void 0, function* () { return BookmarkModel_1.default.find(); });
    }
}
exports.default = BookmarkDao;
BookmarkDao.bookmarkDao = null;
/**
 * Creates singleton DAO instance
 * @returns BookmarkDao
 */
BookmarkDao.getInstance = () => {
    if (BookmarkDao.bookmarkDao === null) {
        BookmarkDao.bookmarkDao = new BookmarkDao();
    }
    return BookmarkDao.bookmarkDao;
};
;
