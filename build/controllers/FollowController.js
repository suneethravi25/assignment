"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FollowDao_1 = __importDefault(require("../daos/FollowDao"));
/**
 * @class FollowController Implements RESTful Web service API for follows resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/following/:userId to create a new follow instance </li>
 *     <li>DELETE /api/users/:uid/following/:userId to remove a particular follow instance </li>
 *     <li>GET /api/users/:uid/followers to retrieve all users that follow a particular user </li>
 *     <li>GET /api/users/:uid/following to retrieve all users that are being followed by a particular
 *     user </li>
 * </ul>
 * @property {FollowDao} followDao Singleton DAO implementing like CRUD operations
 * @property {FollowController} followController Singleton controller implementing
 * RESTful Web service API
 */
class FollowController {
    constructor() {
        /**
         * Retrieves all follow relations to retrieve users that follow a particular user from the database .
         * @param {Request} req Represents request from client, including path parameter representing the ID
         * of a user whose followers are to be retrieved
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the follow objects
         */
        this.findAllFollowersOfUser = (req, res) => FollowController.followDao.findAllFollowersOfUser(req.params.uid)
            .then((followers) => res.json(followers));
        /**
         * Retrieves all follow relations to retrieve users that are being followed by a particular user from
         * the database .
         * @param {Request} req Represents request from client, including path parameter representing the ID
         * of a user whose information is to be retrieved
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON arrays containing the follow objects
         */
        this.findAllFollowingOfUser = (req, res) => FollowController.followDao.findAllFollowingOfUser(req.params.uid)
            .then((following) => res.json(following));
        /**
         * Creates a new follow instance
         * @param {Request} req Represents request from client, including path parameter userId
         * representing ID of user who is following and uid representing ID of user who is being followed
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the new follow instance that was inserted in the
         * database
         */
        this.userFollowsAnotherUser = (req, res) => FollowController.followDao.userFollowsAnotherUser(req.params.userId, req.params.uid)
            .then((follow) => res.json(follow));
        /**
         * Removes a follow instance from the database
         * @param {Request} req Represents request from client, including path parameter userId
         * representing ID of user who is unfollowing and uid representing ID of user who is being unfollowed
         * @param {Response} res Represents response to client, including the
         * body formatted as JSON containing the follow instance that is removed in the
         * database
         */
        this.userUnfollowsAnotherUser = (req, res) => FollowController.followDao.userUnfollowsAnotherUser(req.params.userId, req.params.uid)
            .then((status) => res.send(status));
    }
}
exports.default = FollowController;
FollowController.followDao = FollowDao_1.default.getInstance();
FollowController.followController = null;
/**
 * Creates singleton controller instance
 * @param {Express} app Express instance to declare the RESTful Web service
 * API
 * @return FollowController
 */
FollowController.getInstance = (app) => {
    if (FollowController.followController === null) {
        FollowController.followController = new FollowController();
        app.post("/api/users/:uid/following/:userId", FollowController.followController.userFollowsAnotherUser);
        app.delete("/api/users/:uid/following/:userId", FollowController.followController.userUnfollowsAnotherUser);
        app.get("/api/users/:uid/followers", FollowController.followController.findAllFollowersOfUser);
        app.get("/api/users/:uid/following", FollowController.followController.findAllFollowingOfUser);
    }
    return FollowController.followController;
};
;
