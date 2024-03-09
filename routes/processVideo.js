const express = require("express");
const { processVideoAndPushToAws, generateAdaptiveBitrateHls } = require("../utils/processVideoPushToAws");
const { getS3Path, putObject } = require("../utils/awsUtil");
const router = express.Router();
const path = require("path");
const { writeFile, RootDir, creathFolder, removeFolder, env } = require("../utils/unixUtil");
const { removeFile } = require("../utils/unixUtil");
const fs = require("fs");

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

router.post("/generateABR", (req, res) => {
	const { outputFileName } = req.body;
	generateAdaptiveBitrateHls(req.body);
	res.json({ msg: "your video will be processed shortly and will be available at provided url", videoUrl: getS3Path(outputFileName.split(".").join("/abr.")) });
});

async function doHeavyTask(limit) {
	// File path
	const folderAbsPath = path.join(RootDir, "test");
	await creathFolder(folderAbsPath);
	const filePath = path.join(folderAbsPath, "example.txt");

	// Content to write to the file
	let content = "";
	for (let i = 0; i < limit; i++) {
		content += "a";
		if (Math.random() < 0.01) content += "\n";
	}

	await writeFile(filePath, content);
	const awsresp = await putObject(`test${limit}.txt`, fs.createReadStream(filePath));
	removeFolder(folderAbsPath);
}
router.get("/test", async (req, res) => {
	const limit = parseInt(req.query.limit) || 10;
	await doHeavyTask(limit);
	res.json({ url: getS3Path(`test${limit}.txt`) });
});

module.exports = router;
