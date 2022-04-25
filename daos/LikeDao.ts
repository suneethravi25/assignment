/**
 * @file Implements DAO managing data storage of likes. Uses mongoose LikeModel
 * to integrate with MongoDB
 */
import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/LikeModel";
import Like from "../models/Like";

/**
 * @class LikeDao Implements Data Access Object managing data storage of likes
 * @property {LikeDao} likeDao Private single instance of LikeDao
 */
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns LikeDao
     */
    public static getInstance = (): LikeDao => {
        if(LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }

    private constructor() {}

    /**
     * Uses LikeModel to retrieve all like documents and eventually the users that liked a
     * particular tuit from the likes collection
     * @param {string} tid Primary key of the tuit
     * @returns Promise To be notified when like instances are retrieved from the database
     */
    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel.find({tuit: tid}).populate("likedBy").exec();

    /**
     * Uses LikeModel to retrieve all like documents and eventually the tuits that are liked by a
     * particular user from the likes collection
     * @param {string} uid Primary key of the user
     * @returns Promise To be notified when like instances are retrieved from the database
     */
    findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel
            .find({likedBy: uid})
            .populate({
                path : "tuit",
                populate : {
                    path : "postedBy"
                }
            })
            .exec();

    /**
     * Inserts a like instance into the database
     * @param {string} uid Primary key of the user that likes the tuit
     * @param {string} tid Primary key of the tuit that is liked by the user
     * @returns Promise To be notified when like instance is inserted into the database
     */
    userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({tuit: tid, likedBy: uid});

    /**
     * Removes the like instance from the database.
     * @param {string} uid Primary key of user that unlikes the tuit
     * @param {string} tid Primary key of tuit being unliked
     * @returns Promise To be notified when the like instance is removed from the database
     */
    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid});

    /**
     * Counts the number of like instances that contain the specified tuit
     * and returns a number. In other words, it counts the number of likes a tuit received
     * @param {string} tid Primary key of the tuit
     * @returns number number of likes on the tuit
     */
    countHowManyLikedTuit = async (tid : string) : Promise<any> =>
        LikeModel.count({tuit: tid});

    /**
     * Uses LikeModel to retrieve a like instance based on the liked tuit and
     * the user who liked it from the likes collection
     * @param {string} tid Primary key of the tuit
     * @param {string} tid Primary key of the user
     * @returns Promise To be notified when like instance is retrieved from the database
     */
    findUserLikesTuit = async (uid: string, tid: string) : Promise<any> =>
        LikeModel.findOne({tuit: tid, likedBy: uid}).populate("likedBy").exec();

};