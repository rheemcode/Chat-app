import express, { Express } from "express";
import { Server, Socket } from "socket.io";
import ejs from "ejs";
import http from "http";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import routes from "./routes/route.js"
import Database from "./database.js";
import dotenv from "dotenv";


const port: number = 5000;

const app: Express = express();

dotenv.config();

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(cookieParser())
app.use(
	session({
		secret: "thisIsVerySecretKey",
		resave: true,
		saveUninitialized: false,
	})
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("", routes);

app.set("port", process.env.PORT || 5000);
app.set("host", process.env.HOST);

const server: http.Server = app.listen(app.get("port"), app.get("host"), () => {
	console.log("server started");
});

const io = new Server(server);

io.on("connection", (socket: Socket) => {
	console.log("user connected");
	socket.on("event", async (data) => {
		console.log(data)
		if ("username" in data) {
			await Database.saveMessages(data["username"], data["message"])
			socket.emit("message recieved", data);
			socket.broadcast.emit("message recieved", data);
		}
	})
});

