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
const UserDao_1 = __importDefault(require("../daos/UserDao"));
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
const AuthenticationController = (app) => {
    const userDao = UserDao_1.default.getInstance();
    /**
     * Create a new user and loads a session for that user
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = req.body;
        const password = newUser.password;
        newUser.password = yield bcrypt.hash(password, saltRounds);
        const existingUser = yield userDao.findUserByUsername(req.body.username);
        if (existingUser) {
            res.sendStatus(403);
            return;
        }
        else {
            const insertedUser = yield userDao.createUser(newUser);
            insertedUser.password = '';
            // @ts-ignore
            req.session['profile'] = insertedUser;
            res.json(insertedUser);
        }
    });
    /**
     * Sets an appropriate session with respect to user that is logged in
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const profile = (req, res) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {
            res.json(profile);
        }
        else {
            res.sendStatus(403);
        }
    };
    /**
     * Removes the session of the previously logged in user
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const logout = (req, res) => {
        // @ts-ignore
        req.session.destroy();
        res.sendStatus(200);
    };
    /**
     * Sets an appropriate session when a user logs in
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.body;
        const username = user.username;
        const password = user.password;
        const existingUser = yield userDao
            .findUserByUsername(username);
        const match = yield bcrypt.compare(password, existingUser.password);
        if (match) {
            existingUser.password = '*****';
            // @ts-ignore
            req.session['profile'] = existingUser;
            res.json(existingUser);
        }
        else {
            res.sendStatus(403);
        }
    });
    app.post("/api/auth/register", register);
    app.post("/api/auth/profile", profile);
    app.post("/api/auth/logout", logout);
    app.post("/api/auth/login", login);
};
exports.default = AuthenticationController;
