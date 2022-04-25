/**
 * @file Controller RESTful web service API for dislikes resource
 */
import {Request, Response, Express} from "express";
import DislikeDao from "../daos/DislikeDao";
import TuitDao from "../daos/TuitDao";
import LikeDao from "../daos/LikeDao";


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
export default class DislikeController {
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static dislikeController: DislikeController | null = null;
    /**
     * Create a single instance of the dislike controller
     * @param {Express} app Express instance to declare the RESTful web service API
     * @return DislikeController
     */
    public static getInstance = (app: Express): DislikeController => {
        if (DislikeController.dislikeController === null) {
            DislikeController.dislikeController = new DislikeController();
            app.put("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userTogglesDislikeTuit);
            // app.post("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userDislikesTuit);
            // app.delete("/api/users/:uid/undislikes/:tid", DislikeController.dislikeController.userUndislikesTuit);
            app.get("/api/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
            // app.get("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.findUserDislikesTuit);
        }
        return DislikeController.dislikeController;
    }

    /**
     * Performs update operations on the statistics related to dislikes on tuits in the database when
     * dislike button is clicked
     * @param {Request} req The request from the client, including the path parameters uid and tid representing
     * the user who has liked or disliked a tuit and the related tuit
     * @param {Response} res The response to the client, including status on whether the toggle was successful
     * or not
     */
    userTogglesDislikeTuit = async (req: Request, res: Response) => {
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
            const userAlreadyDislikedTuit = await DislikeController.dislikeDao
                .findUserDislikesTuit(tid, userId);
            const userHasLikedTuit = await DislikeController.likeDao
                .findUserLikesTuit(userId, tid);
            const howManyDislikedTuit = await DislikeController.dislikeDao
                .countHowManyDislikedTuit(tid);
            const howManyLikedTuit = await DislikeController.likeDao
                .countHowManyLikedTuit(tid);
            let tuit = await DislikeController.tuitDao.findTuitById(tid);
            if (userAlreadyDislikedTuit) {
                await DislikeController.dislikeDao.userUndislikesTuit(tid, userId);
                tuit.stats.dislikes = howManyDislikedTuit - 1;
            } else {
                await DislikeController.dislikeDao.userDislikesTuit(tid, userId);
                tuit.stats.dislikes = howManyDislikedTuit + 1;
                if (userHasLikedTuit) {
                    // decrement likes, undislike the tuit
                    await DislikeController.likeDao.userUnlikesTuit(userId, tid);
                    tuit.stats.likes = howManyLikedTuit - 1;
                }
            }
            await DislikeController.tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(400);
        }
    }
    /**
     * Creates a dislike instance in the database
     * @param {Request} req The request from the client, including the path parameters uid and tid representing
     * the user disliking the tuit and the tuit being disliked
     * @param {Response} res The response to the client, including the body as a JSON object containing
     * the new dislike
     */
    userDislikesTuit = (req: Request, res: Response) => {
        return DislikeController.dislikeDao.userDislikesTuit(req.params.tid, req.params.uid)
            .then(dislike => res.json(dislike));
    }
    /**
     * Deletes a dislike instance in the database
     * @param {Request} req The request from the client, including the path parameters uid and tid representing
     * the user undisliking the tuit and the tuit being undisliked
     * @param {Response} res The response to the client, including status on whether deleting the dislike
     * was successful or not
     */
    userUndislikesTuit = (req: Request, res: Response) => {
        return DislikeController.dislikeDao.userUndislikesTuit(req.params.tid, req.params.uid)
            .then(status => res.send(status));
    }

    /**
     * Retrieves all tuits disliked by a user from the database
     * @param {Request} req The request from the client, including the path parameter uid representing the user
     * who has disliked tuits
     * @param {Response} res The response to the client, including the body as a JSON array containing the
     * relevant tuit objects
     */
    findAllTuitsDislikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ? profile._id : uid;
        DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId)
            .then(dislikes => {
                const dislikesNonNullTuits = dislikes.filter(dislike => dislike.tuit);
                const tuitsFromDislikes = dislikesNonNullTuits.map(dislike => dislike.tuit);
                res.json(tuitsFromDislikes);
            })
    }
    /**
     * Retrieves a dislike instance that contains a particular user and a particular tuit
     * @param {Request} req The request from the client, including the path parameters uid and tid representing
     * the user who may have disliked the tuit and the tuit that may have been disliked
     * @param {Response} res The response to the client, including a JSON object containing the related dislike
     */
    findUserDislikesTuit = (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        return DislikeController.dislikeDao.findUserDislikesTuit(tid, userId)
            .then(dislike => res.json(dislike));
    }
};