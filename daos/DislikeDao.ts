/**
 * @file Implements DAO managing data storage of likes. Uses mongoose DislikeModel
 * to integrate with MongoDB
 */

import DislikeModel from "../mongoose/DislikeModel";
import Dislike from "../models/Dislike";

/**
 * @class DislikeDao Implements Data Access Object managing data storage
 * of dislikes
 */
export default class DislikeDao {
    private static dislikeDao: DislikeDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns DislikeDao
     */
    public static getInstance = (): DislikeDao => {
        if (DislikeDao.dislikeDao === null) {
            DislikeDao.dislikeDao = new DislikeDao();
        }
        return DislikeDao.dislikeDao;
    }

    private constructor() {}

    /**
     * Inserts dislike instance into the database
     * @param {string} uid Primary key of the user that dislikes the tuit
     * @param {string} tid Primary key of the tuit that is disliked by the user
     * @returns Promise To be notified when dislike instance is inserted into the database
     */
    userDislikesTuit = async (tid: string, uid: string): Promise<any> =>
        DislikeModel.create({tuit: tid, dislikedBy: uid});

    /**
     * Removes a dislike instance from the database.
     * @param {string} uid Primary key of user that undislikes the tuit
     * @param {string} tid Primary key of tuit being undisliked
     * @returns Promise To be notified when the dislike instance is removed from the database
     */
    userUndislikesTuit = async (tid: string, uid: string): Promise<any> =>
        DislikeModel.deleteOne({tuit: tid, dislikedBy: uid});


    /**
     * Uses DislikeModel to retrieve all dislike documents and eventually the tuits that are
     * disliked by a particular user from the dislikes collection
     * @param {string} uid Primary key of the user
     * @returns Promise To be notified when like instances are retrieved from the database
     */
    findAllTuitsDislikedByUser = async (uid: string): Promise<Dislike[]> =>
        DislikeModel
            .find({dislikedBy: uid})
            .populate({
                path : "tuit",
                populate : {
                    path : "postedBy"
                }
            })
            .exec();

    /**
     * Uses LikeModel to retrieve all like documents and eventually the users that liked a
     * particular tuit from the likes collection
     * @param {string} tid Primary key of the tuit
     * @returns Promise To be notified when like instances are retrieved from the database
     */
    findAllUsersThatDislikedTuit = async (tid: string): Promise<Dislike[]> =>
        DislikeModel
            .find({tuit: tid})
            .populate("dislikedBy")
            .exec();

    /**
     * Uses DislikeModel to retrieve a dislike instance based on the disliked tuit and
     * the user who disliked it from the dislikes collection
     * @param {string} tid Primary key of the tuit
     * @param {string} tid Primary key of the user
     * @returns Promise To be notified when dislike instance is retrieved from the database
     */
    findUserDislikesTuit = async (tid: string, uid: string): Promise<any> =>
        DislikeModel.findOne({tuit: tid, dislikedBy: uid}).populate("dislikedBy").exec();

    /**
     * Counts the number of dislike instances that contain the specified tuit
     * and returns a number. In other words, it counts the number of dislikes a tuit received
     * @param {string} tid Primary key of the tuit
     * @returns number number of dislikes on the tuit
     */
    countHowManyDislikedTuit = async (tid: string): Promise<any> =>
        DislikeModel.count({tuit: tid});
};
