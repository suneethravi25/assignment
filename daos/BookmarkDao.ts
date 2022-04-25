/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import Bookmark from "../models/Bookmark";
import BookmarkModel from "../mongoose/BookmarkModel";

/**
 * Implements Data Access Object managing data storage
 * of Bookmarks
 * @implements {BookmarkDaoI} BookmarkDaoI
 * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
 */
export default class BookmarkDao implements BookmarkDaoI {
    private static bookmarkDao: BookmarkDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns BookmarkDao
     */
    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }

    private constructor() {}

    /**
     * Inserts bookmark instance into the database
     * @param {string} userId Primary key of the user that bookmarks the tuit
     * @param {string} tuitId Primary key of the tuit that is bookmarked by the user
     * @returns Promise To be notified when bookmark instance is inserted into the database
     */
    userBookmarksTuit = async (tuitId: string, userId: string): Promise<any> =>
        BookmarkModel.create({bookmarkedTuit: tuitId, bookmarkedBy: userId})

    /**
     * Removes a bookmark instance from the database.
     * @param {string} userId Primary key of user that unbookmarks the tuit
     * @param {string} tuitId Primary key of tuit being unbookmarked
     * @returns Promise To be notified when the bookmark instance is removed from the database
     */
    userUnbookmarksTuit = async (tuitId: string, userId: string): Promise<any> =>
        BookmarkModel.deleteOne({bookmarkedTuit:tuitId, bookmarkedBy:userId})

    /**
     * Uses BookmarkModel to retrieve all bookmark documents and eventually the tuits that are bookmarked by
     * a particular user from the bookmarks collection
     * @param {string} userId Primary key of the user
     * @returns Promise To be notified when bookmark instances are retrieved from the database
     */
    findAllTuitsBookmarkedByUser = async (userId: string): Promise<Bookmark[]> =>
        BookmarkModel.find({bookmarkedBy:userId}).populate("bookmarkedTuit").exec();

    /**
     * Uses BookmarkModel to retrieve all bookmark documents and eventually the users that bookmarked a
     * particular tuit from the bookmarks collection
     * @param {string} tuitId Primary key of the tuit
     * @returns Promise To be notified when bookmark instances are retrieved from the database
     */
    findAllUsersWhoBookmarkedTuit = async (tuitId: string): Promise<Bookmark[]> =>
        BookmarkModel.find({bookmarkedTuit:tuitId}).populate("bookmarkedBy").exec();

    /**
     * Finds all tuits that are bookmarked.
     * @returns Promise To be notified when bookmark instances are retrieved from the database
     */
    findAllBookmarkedTuits = async (): Promise<Bookmark[]> =>
        BookmarkModel.find()
};