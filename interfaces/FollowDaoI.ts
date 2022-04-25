import Follow from "../models/Follow";

export default interface FollowDaoI {
    userFollowsAnotherUser (userId: string, uid: string): Promise<any>;
    userUnfollowsAnotherUser (userId: string, uid: string): Promise<any>;
    findAllFollowersOfUser (userId: string): Promise<Follow[]>;
    findAllFollowingOfUser (userId: string): Promise<Follow[]>;

};