/**
 * @file Controller RESTful Web service API for authentication requests
 */
import {Express, Request, Response} from "express";
import UserDao from "../daos/UserDao";

const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * @class AuthenticationController Implements RESTful Web service API for authentication requests.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/auth/login to set appropriate session with respect to user that logs in</li>
 *     <li>POST /api/auth/register to create a new user</li>
 *     <li>POST /api/auth/profile to load appropriate profile with respect to user that logs in</li>
 *     <li>POST /api/auth/logout to remove the session associated with the logged in user</li>
 * </ul>
 * @property {UserDao} userDao Singleton DAO implementing users CRUD operations
 * RESTful Web service API
 */
const AuthenticationController = (app: Express) => {
    const userDao: UserDao = UserDao.getInstance();

    /**
     * Create a new user and loads a session for that user
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const register = async(req: Request, res: Response) => {
        const newUser = req.body;
        const password = newUser.password;
        newUser.password = await bcrypt.hash(password, saltRounds);

        const existingUser = await userDao.findUserByUsername(req.body.username);
        if (existingUser) {
            res.sendStatus(403);
            return;
        } else {
            const insertedUser = await userDao.createUser(newUser);
            insertedUser.password = '';
            // @ts-ignore
            req.session['profile'] = insertedUser;
            res.json(insertedUser);
        }
    }

    /**
     * Sets an appropriate session with respect to user that is logged in
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const profile = (req: Request, res: Response) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {
            res.json(profile);
        } else {
            res.sendStatus(403);
        }
    }

    /**
     * Removes the session of the previously logged in user
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const logout = (req: Request, res: Response) => {
        // @ts-ignore
        req.session.destroy();
        res.sendStatus(200);
    }

    /**
     * Sets an appropriate session when a user logs in
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const login = async (req: Request, res: Response) => {
        const user = req.body;
        const username = user.username;
        const password = user.password;
        const existingUser = await userDao
            .findUserByUsername(username);
        const match = await bcrypt.compare(password, existingUser.password);

        if (match) {
            existingUser.password = '*****';
            // @ts-ignore
            req.session['profile'] = existingUser;
            res.json(existingUser);
        } else {
            res.sendStatus(403);
        }
    };


    app.post("/api/auth/register", register);
    app.post("/api/auth/profile", profile);
    app.post("/api/auth/logout", logout);
    app.post("/api/auth/login", login);
}

export default AuthenticationController;