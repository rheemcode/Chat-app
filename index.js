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
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const route_js_1 = __importDefault(require("./routes/route.js"));
const database_js_1 = __importDefault(require("./database.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const port = 5000;
const app = express_1.default();
dotenv_1.default.config();
app.set("view engine", "ejs");
app.use(body_parser_1.default.json());
app.use(cookie_parser_1.default());
app.use(express_session_1.default({
    secret: "thisIsVerySecretKey",
    resave: true,
    saveUninitialized: false,
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use("", route_js_1.default);
app.set("port", process.env.PORT || 5000);
app.set("host", process.env.HOST);
const server = app.listen(app.get("port"), app.get("host"), () => {
    console.log("server started");
});
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("event", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        if ("username" in data) {
            yield database_js_1.default.saveMessages(data["username"], data["message"]);
            socket.emit("message recieved", data);
            socket.broadcast.emit("message recieved", data);
        }
    }));
});
