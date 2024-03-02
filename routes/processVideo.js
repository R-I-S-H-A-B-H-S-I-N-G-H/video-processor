const express = require("express");
const { processVideoAndPushToAws } = require("../utils/processVideoPushToAws");
const router = express.Router();

router
	.get("", (req, res) => {
		res.json({ msg: "HELLo" });
	})
	.post("", async (req, res) => {
		console.log(req.body);
		processVideoAndPushToAws(req.body);
		res.json({ msg: "HELLo" });
	});

module.exports = router;
