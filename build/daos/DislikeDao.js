"use strict";
/**
 * @file Implements DAO managing data storage of likes. Uses mongoose DislikeModel
 * to integrate with MongoDB
 */
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
const DislikeModel_1 = __importDefault(require("../mongoose/DislikeModel"));
/**
 * @class DislikeDao Implements Data Access Object managing data storage
 * of dislikes
 */
class DislikeDao {
    constructor() {
        /**
         * Inserts dislike instance into the database
         * @param {string} uid Primary key of the user that dislikes the tuit
         * @param {string} tid Primary key of the tuit that is disliked by the user
         * @returns Promise To be notified when dislike instance is inserted into the database
         */
        this.userDislikesTuit = (tid, uid) => __awaiter(this, void 0, void 0, function* () { return DislikeModel_1.default.create({ tuit: tid, dislikedBy: uid }); });
        /**
         * Removes a dislike instance from the database.
         * @param {string} uid Primary key of user that undislikes the tuit
         * @param {string} tid Primary key of tuit being undisliked
         * @returns Promise To be notified when the dislike instance is removed from the database
         */
        this.userUndislikesTuit = (tid, uid) => __awaiter(this, void 0, void 0, function* () { return DislikeModel_1.default.deleteOne({ tuit: tid, dislikedBy: uid }); });
        /**
         * Uses DislikeModel to retrieve all dislike documents and eventually the tuits that are
         * disliked by a particular user from the dislikes collection
         * @param {string} uid Primary key of the user
         * @returns Promise To be notified when like instances are retrieved from the database
         */
        this.findAllTuitsDislikedByUser = (uid) => __awaiter(this, void 0, void 0, function* () {
            return DislikeModel_1.default
                .find({ dislikedBy: uid })
                .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
                .exec();
        });
        /**
         * Uses LikeModel to retrieve all like documents and eventually the users that liked a
         * particular tuit from the likes collection
         * @param {string} tid Primary key of the tuit
         * @returns Promise To be notified when like instances are retrieved from the database
         */
        this.findAllUsersThatDislikedTuit = (tid) => __awaiter(this, void 0, void 0, function* () {
            return DislikeModel_1.default
                .find({ tuit: tid })
                .populate("dislikedBy")
                .exec();
        });
        /**
         * Uses DislikeModel to retrieve a dislike instance based on the disliked tuit and
         * the user who disliked it from the dislikes collection
         * @param {string} tid Primary key of the tuit
         * @param {string} tid Primary key of the user
         * @returns Promise To be notified when dislike instance is retrieved from the database
         */
        this.findUserDislikesTuit = (tid, uid) => __awaiter(this, void 0, void 0, function* () { return DislikeModel_1.default.findOne({ tuit: tid, dislikedBy: uid }).populate("dislikedBy").exec(); });
        /**
         * Counts the number of dislike instances that contain the specified tuit
         * and returns a number. In other words, it counts the number of dislikes a tuit received
         * @param {string} tid Primary key of the tuit
         * @returns number number of dislikes on the tuit
         */
        this.countHowManyDislikedTuit = (tid) => __awaiter(this, void 0, void 0, function* () { return DislikeModel_1.default.count({ tuit: tid }); });
    }
}
exports.default = DislikeDao;
DislikeDao.dislikeDao = null;
/**
 * Creates singleton DAO instance
 * @returns DislikeDao
 */
DislikeDao.getInstance = () => {
    if (DislikeDao.dislikeDao === null) {
        DislikeDao.dislikeDao = new DislikeDao();
    }
    return DislikeDao.dislikeDao;
};
;
