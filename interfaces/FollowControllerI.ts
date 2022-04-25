import {Request, Response} from "express";

export default interface FollowControllerI {
    userFollowsAnotherUser (req: Request, res: Response): void;
    userUnfollowsAnotherUser (req: Request, res: Response): void;
    findAllFollowersOfUser (req: Request, res: Response): void;
    findAllFollowingOfUser (req: Request, res: Response): void;
};