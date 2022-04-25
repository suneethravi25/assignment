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
const FollowModel_1 = __importDefault(require("../mongoose/FollowModel"));
/**
 * @class FollowDao Implements Data Access Object managing data storage of follows collection.
 * @property {FollowDao} followDao Private single instance of FollowDao
 */
class FollowDao {
    constructor() {
        /**
         * Uses FollowModel to retrieve all follow documents and eventually the users that are following
         * a particular user from the follows collection
         * @param {string} userId Primary key of the user whose followers are to be retrieved
         * @returns Promise To be notified when follow instances are retrieved from the database
         */
        this.findAllFollowersOfUser = (userId) => __awaiter(this, void 0, void 0, function* () { return FollowModel_1.default.find({ userFollowed: userId }).populate("userFollowing").exec(); });
        /**
         * Uses FollowModel to retrieve all follow documents and eventually the users that are being
         * followed a particular user from the follows collection
         * @param {string} userId Primary key of the user whose information is to be retrieved
         * @returns Promise To be notified when follow instances are retrieved from the database
         */
        this.findAllFollowingOfUser = (userId) => __awaiter(this, void 0, void 0, function* () { return FollowModel_1.default.find({ userFollowing: userId }).populate("userFollowed").exec(); });
        /**
         * Inserts a follow instance into the database
         * @param {string} userId Primary key of the user that is being followed
         * @param {string} uid Primary key of the user that is following
         * @returns Promise To be notified when follow instance is inserted into the database
         */
        this.userFollowsAnotherUser = (userId, uid) => __awaiter(this, void 0, void 0, function* () { return FollowModel_1.default.create({ userFollowed: userId, userFollowing: uid }); });
        /**
         * Removes a follow instance from the database
         * @param {string} userId Primary key of the user that is being unfollowed
         * @param {string} uid Primary key of the user who is unfollowing.
         * @returns Promise To be notified when follow instance is removed from the database
         */
        this.userUnfollowsAnotherUser = (userId, uid) => __awaiter(this, void 0, void 0, function* () { return FollowModel_1.default.deleteOne({ userFollowed: userId, userFollowing: uid }); });
    }
}
exports.default = FollowDao;
FollowDao.followDao = null;
/**
 * Creates singleton DAO instance
 * @returns FollowDao
 */
FollowDao.getInstance = () => {
    if (FollowDao.followDao === null) {
        FollowDao.followDao = new FollowDao();
    }
    return FollowDao.followDao;
};
;
