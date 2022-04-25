import {Request, Response} from "express";

export default interface MessageControllerI {
    findAllMessages (req: Request, res: Response): void;
    findAllMessagesReceivedByUser (req: Request, res: Response): void;
    findAllMessagesSentByUser (req: Request, res: Response): void;
    userDeletesMessage (req: Request, res: Response): void;
    userSendsMessage (req: Request, res: Response): void;
};