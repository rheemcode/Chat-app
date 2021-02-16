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
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
class ChatDatabase {
    static initDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            this.database = yield sqlite_1.open({ filename: "database.db", driver: sqlite3_1.default.Database });
            yield this._createTable();
        });
    }
    static _createTable() {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "CREATE TABLE IF NOT EXISTS Messages (username TEXT, message TEXT, time Date, id INTEGER PRIMARY KEY AUTOINCREMENT)";
            ChatDatabase.database.exec(query);
        });
    }
    static getMessages(limit = 100, name = "") {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            if (name == "") {
                query = "SELECT * FROM MESSAGES ORDER BY date(time) DESC";
                return this.database.all(query);
            }
            query = "SELECT * FROM MESSAGES WHERE username = ? ORDER BY date(time) DESC";
            return this.database.all(query, name);
        });
    }
    static getMessagesByName(limit, name = "") {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getMessages(limit, name);
        });
    }
    static saveMessages(name, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "INSERT INTO MESSAGES (username, message, time) VALUES (?, ?, ?)";
            this.database.run(query, name, message, Date.now());
        });
    }
    static close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.database.close();
        });
    }
}
exports.default = ChatDatabase;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield ChatDatabase.initDatabase();
    let res = yield ChatDatabase.getMessagesByName(100);
    console.log(res);
}))();
