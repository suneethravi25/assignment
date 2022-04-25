/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
import TuitModel from "../mongoose/TuitModel";
import Tuit from "../models/Tuit";
import TuitDaoI from "../interfaces/TuitDaoI";

/**
 * @class UserDao Implements Data Access Object managing data storage of Users
 * @implements {TuitDaoI} TuitDaoI Tuit Dao Interface
 * @property {UserDao} userDao Private single instance of UserDao
 */
export default class TuitDao implements TuitDaoI{
    private static tuitDao: TuitDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns TuitDao
     */
    public static getInstance = (): TuitDao => {
        if(TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }
    private constructor() {}

    /**
     * Uses TuitModel to retrieve all tuit documents from tuits collection
     * @returns Promise To be notified when the tuits are retrieved from the database
     */
    findAllTuits = async (): Promise<Tuit[]> =>
        await TuitModel.find().populate("postedBy").exec();

    /**
     * Uses TuitModel to retrieve all tuit documents that are posted by a particular user
     * from tuits collection
     * @param {string} uid User's primary key
     * @returns Promise To be notified when the tuits are retrieved from database
     */
    findAllTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        await TuitModel.find({postedBy: uid}).populate("postedBy").exec();

    /**
     * Uses TuitModel to retrieve single tuit document from tuits collection
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when tuit is retrieved from the database
     */
    findTuitById = async (tid: string): Promise<any> =>
        await TuitModel.findById(tid)
            .populate("postedBy")
            .exec();

    /**
     * Inserts a new tuit instance into the database
     * @param {string} uid User's primary key
     * @param {Tuit} tuit Instance to be inserted into the database
     * @returns Promise To be notified when tuit is inserted into the database
     */
    createTuitByUser = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        await TuitModel.create({...tuit, postedBy: uid});

    /**
     * Updates tuit with new values in database
     * @param {string} tid Primary key of tuit to be modified
     * @param {Tuit} tuit Tuit object containing properties and their new values
     * @returns Promise To be notified when tuit is updated in the database
     */
    updateTuit = async (tid: string, tuit: Tuit): Promise<any> =>
        await TuitModel.updateOne(
            {_id: tid},
            {$set: tuit});

    /**
     * Removes the tuit from the database.
     * @param {string} tid Primary key of tuit to be removed
     * @returns Promise To be notified when tuit is removed from the database
     */
    deleteTuit = async (tid: string): Promise<any> =>
        await TuitModel.deleteOne({_id: tid});

    /**
     * Updates tuit with new values of tuit statistics in database
     * @param {string} tid Primary key of tuit to be modified
     * @param {Stats} tuit Stats object containing properties and their new values
     * @returns Promise To be notified when tuit is updated in the database
     */
    updateLikes = async (tid : string, newStats: any) =>
            TuitModel.updateOne(
                {_id: tid},
                {$set: {stats: newStats}});
}