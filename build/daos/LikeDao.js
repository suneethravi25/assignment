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
const LikeModel_1 = __importDefault(require("../mongoose/LikeModel"));
/**
 * @class LikeDao Implements Data Access Object managing data storage of likes
 * @property {LikeDao} likeDao Private single instance of LikeDao
 */
class LikeDao {
    constructor() {
        /**
         * Uses LikeModel to retrieve all like documents and eventually the users that liked a
         * particular tuit from the likes collection
         * @param {string} tid Primary key of the tuit
         * @returns Promise To be notified when like instances are retrieved from the database
         */
        this.findAllUsersThatLikedTuit = (tid) => __awaiter(this, void 0, void 0, function* () { return LikeModel_1.default.find({ tuit: tid }).populate("likedBy").exec(); });
        /**
         * Uses LikeModel to retrieve all like documents and eventually the tuits that are liked by a
         * particular user from the likes collection
         * @param {string} uid Primary key of the user
         * @returns Promise To be notified when like instances are retrieved from the database
         */
        this.findAllTuitsLikedByUser = (uid) => __awaiter(this, void 0, void 0, function* () {
            return LikeModel_1.default
                .find({ likedBy: uid })
                .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
                .exec();
        });
        /**
         * Inserts a like instance into the database
         * @param {string} uid Primary key of the user that likes the tuit
         * @param {string} tid Primary key of the tuit that is liked by the user
         * @returns Promise To be notified when like instance is inserted into the database
         */
        this.userLikesTuit = (uid, tid) => __awaiter(this, void 0, void 0, function* () { return LikeModel_1.default.create({ tuit: tid, likedBy: uid }); });
        /**
         * Removes the like instance from the database.
         * @param {string} uid Primary key of user that unlikes the tuit
         * @param {string} tid Primary key of tuit being unliked
         * @returns Promise To be notified when the like instance is removed from the database
         */
        this.userUnlikesTuit = (uid, tid) => __awaiter(this, void 0, void 0, function* () { return LikeModel_1.default.deleteOne({ tuit: tid, likedBy: uid }); });
        /**
         * Counts the number of like instances that contain the specified tuit
         * and returns a number. In other words, it counts the number of likes a tuit received
         * @param {string} tid Primary key of the tuit
         * @returns number number of likes on the tuit
         */
        this.countHowManyLikedTuit = (tid) => __awaiter(this, void 0, void 0, function* () { return LikeModel_1.default.count({ tuit: tid }); });
        /**
         * Uses LikeModel to retrieve a like instance based on the liked tuit and
         * the user who liked it from the likes collection
         * @param {string} tid Primary key of the tuit
         * @param {string} tid Primary key of the user
         * @returns Promise To be notified when like instance is retrieved from the database
         */
        this.findUserLikesTuit = (uid, tid) => __awaiter(this, void 0, void 0, function* () { return LikeModel_1.default.findOne({ tuit: tid, likedBy: uid }).populate("likedBy").exec(); });
    }
}
exports.default = LikeDao;
LikeDao.likeDao = null;
/**
 * Creates singleton DAO instance
 * @returns LikeDao
 */
LikeDao.getInstance = () => {
    if (LikeDao.likeDao === null) {
        LikeDao.likeDao = new LikeDao();
    }
    return LikeDao.likeDao;
};
;
