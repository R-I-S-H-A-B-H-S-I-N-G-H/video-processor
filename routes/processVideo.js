const express = require("express");
const { processVideoAndPushToAws } = require("../utils/processVideoPushToAws");
const { getS3Path } = require("../utils/awsUtil");
const router = express.Router();
const path = require("path");

router
	.get("", (req, res) => {
		res.json({ msg: "HELLo" });
	})
	.post("", async (req, response) => {
		console.log(req.body);
		processVideoAndPushToAws(req.body);
		const { outputFileName, res } = req.body;
		response.json({ msg: "your video will be processed shortly and will be available at provided url", videoUrl: getS3Path(`${path.parse(outputFileName).name}/${res}.m3u8`) });
	});

module.exports = router;
