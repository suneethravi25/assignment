/**
 * @file Implements DAO managing data storage of follow relations. Uses mongoose FollowModel
 * to integrate with MongoDB
 */
import FollowDaoI from "../interfaces/FollowDaoI";
import Follow from "../models/Follow";
import FollowModel from "../mongoose/FollowModel";

/**
 * @class FollowDao Implements Data Access Object managing data storage of follows collection.
 * @property {FollowDao} followDao Private single instance of FollowDao
 */
export default class FollowDao implements FollowDaoI{
    private static followDao : FollowDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns FollowDao
     */
    public static getInstance = () : FollowDao => {
        if (FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }

    private constructor() {}

    /**
     * Uses FollowModel to retrieve all follow documents and eventually the users that are following
     * a particular user from the follows collection
     * @param {string} userId Primary key of the user whose followers are to be retrieved
     * @returns Promise To be notified when follow instances are retrieved from the database
     */
    findAllFollowersOfUser = async (userId:string) : Promise<Follow[]> =>
        FollowModel.find({userFollowed:userId}).populate("userFollowing").exec();

    /**
     * Uses FollowModel to retrieve all follow documents and eventually the users that are being
     * followed a particular user from the follows collection
     * @param {string} userId Primary key of the user whose information is to be retrieved
     * @returns Promise To be notified when follow instances are retrieved from the database
     */
    findAllFollowingOfUser = async (userId:string) : Promise<Follow[]> =>
    FollowModel.find({userFollowing:userId}).populate("userFollowed").exec();

    /**
     * Inserts a follow instance into the database
     * @param {string} userId Primary key of the user that is being followed
     * @param {string} uid Primary key of the user that is following
     * @returns Promise To be notified when follow instance is inserted into the database
     */
    userFollowsAnotherUser = async (userId:string, uid:string) : Promise<any> =>
        FollowModel.create({userFollowed:userId, userFollowing:uid});

    /**
     * Removes a follow instance from the database
     * @param {string} userId Primary key of the user that is being unfollowed
     * @param {string} uid Primary key of the user who is unfollowing.
     * @returns Promise To be notified when follow instance is removed from the database
     */
    userUnfollowsAnotherUser = async (userId:string, uid:string) : Promise<any> =>
        FollowModel.deleteOne({userFollowed:userId, userFollowing:uid});
};