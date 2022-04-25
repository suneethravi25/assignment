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
const DislikeDao_1 = __importDefault(require("../daos/DislikeDao"));
const TuitDao_1 = __importDefault(require("../daos/TuitDao"));
const LikeDao_1 = __importDefault(require("../daos/LikeDao"));
/**
 * @class DislikeController Implements RESTful web service API for dislikes resource
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>PUT /api/users/:uid/dislikes/:tid to update a dislike instance when dislike button is clicked</li>
 *     <li>GET /api/users/:uid/dislikes to retrieve all tuits disliked by a user</li>
 * </ul>
 * @property {DislikeDao} dislikeDao Singleton DAO implementing dislikes CRUD operations
 * @property {LikeDao} likeDao Singleton DAO implementing likes CRUD operations
 * @property {DislikeController} dislikeController Singleton controller implementing RESTful web service API
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 */
class DislikeController {
    constructor() {
        /**
         * Performs update operations on the statistics related to dislikes on tuits in the database when
         * dislike button is clicked
         * @param {Request} req The request from the client, including the path parameters uid and tid representing
         * the user who has liked or disliked a tuit and the related tuit
         * @param {Response} res The response to the client, including status on whether the toggle was successful
         * or not
         */
        this.userTogglesDislikeTuit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const uid = req.params.uid;
            const tid = req.params.tid;
            // @ts-ignore
            const profile = req.session['profile'];
            const userId = uid === "me" && profile ?
                profile._id : uid;
            if (userId === "me") {
                res.sendStatus(503);
                return;
            }
            try {
                const userAlreadyDislikedTuit = yield DislikeController.dislikeDao
                    .findUserDislikesTuit(tid, userId);
                const userHasLikedTuit = yield DislikeController.likeDao
                    .findUserLikesTuit(userId, tid);
                const howManyDislikedTuit = yield DislikeController.dislikeDao
                    .countHowManyDislikedTuit(tid);
                const howManyLikedTuit = yield DislikeController.likeDao
                    .countHowManyLikedTuit(tid);
                let tuit = yield DislikeController.tuitDao.findTuitById(tid);
                if (userAlreadyDislikedTuit) {
                    yield DislikeController.dislikeDao.userUndislikesTuit(tid, userId);
                    tuit.stats.dislikes = howManyDislikedTuit - 1;
                }
                else {
                    yield DislikeController.dislikeDao.userDislikesTuit(tid, userId);
                    tuit.stats.dislikes = howManyDislikedTuit + 1;
                    if (userHasLikedTuit) {
                        // decrement likes, undislike the tuit
                        yield DislikeController.likeDao.userUnlikesTuit(userId, tid);
                        tuit.stats.likes = howManyLikedTuit - 1;
                    }
                }
                yield DislikeController.tuitDao.updateLikes(tid, tuit.stats);
                res.sendStatus(200);
            }
            catch (e) {
                res.sendStatus(400);
            }
        });
        /**
         * Creates a dislike instance in the database
         * @param {Request} req The request from the client, including the path parameters uid and tid representing
         * the user disliking the tuit and the tuit being disliked
         * @param {Response} res The response to the client, including the body as a JSON object containing
         * the new dislike
         */
        this.userDislikesTuit = (req, res) => {
            return DislikeController.dislikeDao.userDislikesTuit(req.params.tid, req.params.uid)
                .then(dislike => res.json(dislike));
        };
        /**
         * Deletes a dislike instance in the database
         * @param {Request} req The request from the client, including the path parameters uid and tid representing
         * the user undisliking the tuit and the tuit being undisliked
         * @param {Response} res The response to the client, including status on whether deleting the dislike
         * was successful or not
         */
        this.userUndislikesTuit = (req, res) => {
            return DislikeController.dislikeDao.userUndislikesTuit(req.params.tid, req.params.uid)
                .then(status => res.send(status));
        };
        /**
         * Retrieves all tuits disliked by a user from the database
         * @param {Request} req The request from the client, including the path parameter uid representing the user
         * who has disliked tuits
         * @param {Response} res The response to the client, including the body as a JSON array containing the
         * relevant tuit objects
         */
        this.findAllTuitsDislikedByUser = (req, res) => {
            const uid = req.params.uid;
            // @ts-ignore
            const profile = req.session['profile'];
            const userId = uid === "me" && profile ? profile._id : uid;
            DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId)
                .then(dislikes => {
                const dislikesNonNullTuits = dislikes.filter(dislike => dislike.tuit);
                const tuitsFromDislikes = dislikesNonNullTuits.map(dislike => dislike.tuit);
                res.json(tuitsFromDislikes);
            });
        };
        /**
         * Retrieves a dislike instance that contains a particular user and a particular tuit
         * @param {Request} req The request from the client, including the path parameters uid and tid representing
         * the user who may have disliked the tuit and the tuit that may have been disliked
         * @param {Response} res The response to the client, including a JSON object containing the related dislike
         */
        this.findUserDislikesTuit = (req, res) => {
            const uid = req.params.uid;
            const tid = req.params.tid;
            // @ts-ignore
            const profile = req.session['profile'];
            const userId = uid === "me" && profile ?
                profile._id : uid;
            return DislikeController.dislikeDao.findUserDislikesTuit(tid, userId)
                .then(dislike => res.json(dislike));
        };
    }
}
exports.default = DislikeController;
DislikeController.dislikeDao = DislikeDao_1.default.getInstance();
DislikeController.tuitDao = TuitDao_1.default.getInstance();
DislikeController.likeDao = LikeDao_1.default.getInstance();
DislikeController.dislikeController = null;
/**
 * Create a single instance of the dislike controller
 * @param {Express} app Express instance to declare the RESTful web service API
 * @return DislikeController
 */
DislikeController.getInstance = (app) => {
    if (DislikeController.dislikeController === null) {
        DislikeController.dislikeController = new DislikeController();
        app.put("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userTogglesDislikeTuit);
        // app.post("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userDislikesTuit);
        // app.delete("/api/users/:uid/undislikes/:tid", DislikeController.dislikeController.userUndislikesTuit);
        app.get("/api/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
        // app.get("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.findUserDislikesTuit);
    }
    return DislikeController.dislikeController;
};
;
