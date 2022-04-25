/**
 * @file Controller RESTful Web service API for bookmarks resource
 */
import BookmarkDao from "../daos/BookmarkDao";
import Bookmark from "../models/Bookmark";
import {Express, Request, Response} from "express";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/bookmarks to retrieve all tuits bookmarked by a user</li>
 *     <li>GET /api/bookmarks/:tid to retrieve all users that bookmarked a tuit</li>
 *     <li>POST /api/users/:uid/bookmarks/:tid to create a new bookmark instance</li>
 *     <li>DELETE /api/users/:uid/bookmarks/:tid to remove a particular bookmark instance</li>
 *     <li>GET /api/bookmarks to retrieve all bookmarked tuits</li>
 * </ul>
 * @property {BookmarkDao} bookmarkDao Singleton DAO implementing like CRUD operations
 * @property {BookmarkController} bookmarkController Singleton controller implementing
 * RESTful Web service API
 */
export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return BookmarkController
     */
    public static getInstance = (app: Express): BookmarkController => {
        if (BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.get("/api/bookmarks", BookmarkController.bookmarkController.findAllBookmarkedTuits);
            app.get("/api/users/:uid/bookmarks", BookmarkController.bookmarkController.findAllTuitsBookmarkedByUser);
            app.get("/api/bookmarks/:tid", BookmarkController.bookmarkController.findAllUsersWhoBookmarkedTuit);
            app.post("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userBookmarksTuit);
            app.delete("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userUnbookmarksTuit);
        }
        return BookmarkController.bookmarkController;
    }

    private constructor() {
    }

    /**
     * Gets all bookmark instances from the database
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the array of bookmark instances from the
     * database
     */
    findAllBookmarkedTuits = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllBookmarkedTuits()
            .then((bookmarks: Bookmark[]) => res.json(bookmarks));

    /**
     * Retrieves all bookmark relations to retrieve users that bookmarked a particular tuit from the database .
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user that bookmarked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the bookmark objects
     */
    findAllTuitsBookmarkedByUser = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(req.params.uid)
            .then((tuits: Bookmark[]) => res.json(tuits));

    /**
     * Retrieves all bookmark relations to retrieve bookmarks liked by a particular user from the database .
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the bookmarked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the bookmark objects
     */
    findAllUsersWhoBookmarkedTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllUsersWhoBookmarkedTuit(req.params.tid)
            .then((users: Bookmark[]) => res.json(users));

    /**
     * Creates a new bookmark instance
     * @param {Request} req Represents request from client, including path parameter uid
     * representing ID of user who bookmarks and tid representing ID of tuit that is being bookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmark instance that was inserted in the
     * database
     */
    userBookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userBookmarksTuit(req.params.tid, req.params.uid)
            .then((bookmark: Bookmark) => res.json(bookmark));

    /**
     * Removes a bookmark instance from the database
     * @param {Request} req Represents request from client, including path parameter uid
     * representing ID of user who unbookmarks and tid representing ID of tuit that is being unbookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the bookmark instance that was removed from the
     * database
     */
    userUnbookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userUnbookmarksTuit(req.params.tid, req.params.uid)
            .then((bookmark: Bookmark) => res.json(bookmark));
};