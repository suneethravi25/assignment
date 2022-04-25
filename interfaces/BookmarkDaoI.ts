import Bookmark from "../models/Bookmark";

export default interface BookmarkDaoI {
    userBookmarksTuit (tuitId: string, userId: string): Promise<any>;
    userUnbookmarksTuit (tuitId: string, userId: string): Promise<any>;
    findAllTuitsBookmarkedByUser (userId: string): Promise<Bookmark[]>;
    findAllUsersWhoBookmarkedTuit (tuitId: string): Promise<Bookmark[]>;
    findAllBookmarkedTuits (): Promise<Bookmark[]>;
};