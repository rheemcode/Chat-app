import { Router } from "express";
import Database from "../database";
import moment from "moment";

const router = Router();

router.get("/", (req, res) => {
	if (req.session["username"]) {
		if (req.session.message) {
			res.render("home", { message: req.session.message });
		}
		else {
			res.render("home", { message: "" })
		}
	}
	else {
		res.redirect("/login");
	}
})

router.get("/home", (req, res) => {
	if (req.session["username"]) {
		if (req.session.message) {
			res.render("home", { message: req.session.message });
		}
		else {
			res.render("home", { message: "" })
		}

	}
	else {
		res.redirect("/login");
	}

})


router.get("/login", (req, res) => {
	if (typeof (req.session.messages) == "undefined")
		res.render("login", { message: "" });
	else
		res.render("login", { message: req.session.message });
})


router.get("/logout", (req, res) => {
	req.session.message = "You were logged out";
	req.session["username"] = "";
	res.redirect("login");
})


router.get("/history", async (req, res) => {
	if (req.session["username"]) {
		let messages = await Database.getMessagesByName(100, req.session["username"]);

		messages.forEach(message => {
			message["time"] = moment(message["time"]).fromNow();
		})

		console.log(messages[0])
		if (messages.length) {
			console.log(messages)
			res.render("history", { messageHistory: messages });
		}
		else {
			res.render("history", { messageHistory: "" })
		}
	}
	else {
		req.session.message = "Please login before viewing message history";
		res.redirect("login");
	}
});



router.get("/get_username", (req, res) => {
	let result = { username: "" };
	if (req.session["username"]) {
		result = { username: req.session["username"] };
		res.json(result);
	}
	else {
		res.json("user not found");
	}
})

router.get("/get_messages", async (req, res) => {
	try {
		let messages = [await Database.getMessages(100)];
		res.json(messages);
	} catch (e) {
		res.json(e);
	}

})

router.post("/login", (req, res) => {
	let username: string = req.body.username
	if (username.length >= 2) {
		req.session["username"] = username;
		req.session.message = `You were successfully logged in as ${req.session["username"]}`
		res.redirect("/home");
	}
	else {
		res.render("login", { message: "Name must be more than 1 character" });
	}
});


export default router;