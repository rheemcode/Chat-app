import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import moment from "moment";

export default class ChatDatabase {
	private static database: Database;

	static async initDatabase() {
		this.database = await open({ filename: "database.db", driver: sqlite3.Database });
		await this._createTable();
	}

	private static async _createTable() {
		let query = "CREATE TABLE IF NOT EXISTS Messages (username TEXT, message TEXT, time Date, id INTEGER PRIMARY KEY AUTOINCREMENT)";
		ChatDatabase.database.exec(query);
	}

	static async getMessages(limit: number = 100, name: string = "") {
		let query;
		if (name == "") {
			query = "SELECT * FROM MESSAGES ORDER BY date(time) DESC"
			return this.database.all(query);
		}

		query = "SELECT * FROM MESSAGES WHERE username = ? ORDER BY date(time) DESC"
		return this.database.all(query, name);
	}

	static async getMessagesByName(limit: number, name: string = "") {
		return this.getMessages(limit, name);
	}

	static async saveMessages(name: string, message: string) {
		let query = "INSERT INTO MESSAGES (username, message, time) VALUES (?, ?, ?)"
		this.database.run(query, name, message, Date.now());
	}

	static async close() {
		this.database.close();
	}
}



(async () => {
	await ChatDatabase.initDatabase();
	let res = await ChatDatabase.getMessagesByName(100,);
	console.log(res);
})();
