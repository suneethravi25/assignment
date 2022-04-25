/**
 * @file Implements an Express Node HTTP server. Declares RESTful Web services
 * enabling CRUD operations on the following resources:
 * <ul>
 *     <li>users</li>
 *     <li>tuits</li>
 *     <li>likes</li>
 *     <li>bookmarks</li>
 *     <li>follows</li>
 *     <li>messages</li>
 * </ul>
 *
 * Connects to a remote MongoDB instance hosted on the Atlas cloud database
 * service
 */
import express, {Request, Response} from 'express';
import mongoose from "mongoose";
import UserController from "./controllers/UserController";
import TuitController from "./controllers/TuitController";
import BookmarkController from "./controllers/BookmarkController";
import FollowController from "./controllers/FollowController";
import MessageController from "./controllers/MessageController";
import LikeController from "./controllers/LikeController";
import DislikeController from "./controllers/DislikeController";
import AuthenticationController from "./controllers/AuthenticationController";
import SessionController from "./controllers/SessionController";
import 'dotenv/config'

var cors = require('cors');
const session = require("express-session");

const connectionString = `mongodb+srv://Suneeth:Novablast25@cluster0.ivkbs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(connectionString);

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://assignment4react.netlify.app']
}));

let sess = {
    secret: process.env.SECRET,
    proxy: true,
    saveUninitialized : true,
    resave : true,
    cookie : {
        sameSite: process.env.ENVIRONMENT === "PRODUCTION" ? 'none' : 'lax',
        secure: process.env.ENVIRONMENT === "PRODUCTION",
    }
}

if (process.env.ENVIRONMENT === 'PRODUCTION ') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use(session(sess));
app.use(express.json());

app.get('/', (req: Request, res: Response) =>
    res.send('Welcome!'));

// Create RESTful Web service API
app.get('/add/:a/:b', (req: Request, res: Response) =>
    res.send(req.params.a + req.params.b));

const userController = UserController.getInstance(app);
const tuitController = TuitController.getInstance(app);
const bookmarkController = BookmarkController.getInstance(app);
const followController = FollowController.getInstance(app);
const messageController = MessageController.getInstance(app);
const likesController = LikeController.getInstance(app);
const dislikeController = DislikeController.getInstance(app);
SessionController(app);
AuthenticationController(app);
/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);