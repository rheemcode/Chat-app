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
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const moment_1 = __importDefault(require("moment"));
const router = express_1.Router();
router.get("/", (req, res) => {
    if (req.session["username"]) {
        if (req.session.message) {
            res.render("home", { message: req.session.message });
        }
        else {
            res.render("home", { message: "" });
        }
    }
    else {
        res.redirect("/login");
    }
});
router.get("/home", (req, res) => {
    if (req.session["username"]) {
        if (req.session.message) {
            res.render("home", { message: req.session.message });
        }
        else {
            res.render("home", { message: "" });
        }
    }
    else {
        res.redirect("/login");
    }
});
router.get("/login", (req, res) => {
    if (typeof (req.session.messages) == "undefined")
        res.render("login", { message: "" });
    else
        res.render("login", { message: req.session.message });
});
router.get("/logout", (req, res) => {
    req.session.message = "You were logged out";
    req.session["username"] = "";
    res.redirect("login");
});
router.get("/history", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session["username"]) {
        let messages = yield database_1.default.getMessagesByName(100, req.session["username"]);
        messages.forEach(message => {
            message["time"] = moment_1.default(message["time"]).fromNow();
        });
        console.log(messages[0]);
        if (messages.length) {
            console.log(messages);
            res.render("history", { messageHistory: messages });
        }
        else {
            res.render("history", { messageHistory: "" });
        }
    }
    else {
        req.session.message = "Please login before viewing message history";
        res.redirect("login");
    }
}));
router.get("/get_username", (req, res) => {
    let result = { username: "" };
    if (req.session["username"]) {
        result = { username: req.session["username"] };
        res.json(result);
    }
    else {
        res.json("user not found");
    }
});
router.get("/get_messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let messages = [yield database_1.default.getMessages(100)];
        res.json(messages);
    }
    catch (e) {
        res.json(e);
    }
}));
router.post("/login", (req, res) => {
    let username = req.body.username;
    if (username.length >= 2) {
        req.session["username"] = username;
        req.session.message = `You were successfully logged in as ${req.session["username"]}`;
        res.redirect("/home");
    }
    else {
        res.render("login", { message: "Name must be more than 1 character" });
    }
});
exports.default = router;
