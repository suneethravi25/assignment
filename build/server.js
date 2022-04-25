"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const TuitController_1 = __importDefault(require("./controllers/TuitController"));
const BookmarkController_1 = __importDefault(require("./controllers/BookmarkController"));
const FollowController_1 = __importDefault(require("./controllers/FollowController"));
const MessageController_1 = __importDefault(require("./controllers/MessageController"));
const LikeController_1 = __importDefault(require("./controllers/LikeController"));
const DislikeController_1 = __importDefault(require("./controllers/DislikeController"));
const AuthenticationController_1 = __importDefault(require("./controllers/AuthenticationController"));
const SessionController_1 = __importDefault(require("./controllers/SessionController"));
require("dotenv/config");
var cors = require('cors');
const session = require("express-session");
const connectionString = `mongodb+srv://Suneeth:Novablast25@cluster0.ivkbs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose_1.default.connect(connectionString);
const app = (0, express_1.default)();
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://assignment4react.netlify.app']
}));
let sess = {
    secret: process.env.SECRET,
    proxy: true,
    saveUninitialized: true,
    resave: true,
    cookie: {
        sameSite: process.env.ENVIRONMENT === "PRODUCTION" ? 'none' : 'lax',
        secure: process.env.ENVIRONMENT === "PRODUCTION",
    }
};
if (process.env.ENVIRONMENT === 'PRODUCTION ') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}
app.use(session(sess));
app.use(express_1.default.json());
app.get('/', (req, res) => res.send('Welcome!'));
// Create RESTful Web service API
app.get('/add/:a/:b', (req, res) => res.send(req.params.a + req.params.b));
const userController = UserController_1.default.getInstance(app);
const tuitController = TuitController_1.default.getInstance(app);
const bookmarkController = BookmarkController_1.default.getInstance(app);
const followController = FollowController_1.default.getInstance(app);
const messageController = MessageController_1.default.getInstance(app);
const likesController = LikeController_1.default.getInstance(app);
const dislikeController = DislikeController_1.default.getInstance(app);
(0, SessionController_1.default)(app);
(0, AuthenticationController_1.default)(app);
/**
 * Start a server listening at port 4000 locally
 * but use environment variable PORT on Heroku if available.
 */
const PORT = 4000;
app.listen(process.env.PORT || PORT);
