/**
 * @file Controller RESTful Web service API for authentication requests
 */
import {Request, Response, Express} from "express";

/**
 * @class SessionController Implements RESTful Web service API for session requests.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/session/set/:name/:value to set the session</li>
 *     <li>GET /api/session/get/:name to get the session</li>
 *     <li>GET /api/session/get to get all sessions</li>
 *     <li>GET /api/session/reset to reset session</li>
 * </ul>
 */
const SessionController = (app: Express) => {

    /**
     * Sets an appropriate session
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const setSession = (req: Request, res: Response) => {
        var name = req.params['name'];
        var value = req.params['value'];
        // @ts-ignore
        req.session[name] = value;
        res.send(req.session);
    }

    /**
     * Retrieves a session based on which user loggen in
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const getSession = (req: Request, res: Response) => {
        var name = req.params['name'];
        // @ts-ignore
        var value = req.session[name];
        res.send(value);
    }

    /**
     * Retrieves all the sessions
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const getSessionAll = (req: Request, res: Response) => {
        // @ts-ignore
        res.send(req.session);
    }

    /**
     * Resets a session
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    const resetSession = (req: Request, res: Response) => {
        // @ts-ignore
        req.session.destroy();
        res.send(200);
    }

    app.get('/api/session/set/:name/:value',
        setSession);
    app.get('/api/session/get/:name',
        getSession);
    app.get('/api/session/get',
        getSessionAll);
    app.get('/api/session/reset',
        resetSession);
}

export default SessionController;