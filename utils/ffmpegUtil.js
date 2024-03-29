"use strict";

const { spawnExec } = require("./spawnUtil");
const { randomUUID } = require("crypto");
const { removeFile, creathFolder } = require("./unixUtil");
const path = require("path");
const ffmpeg_static_path = require("ffmpeg-static");
async function processVideoSingle(props) {
	const { inputPath, outputPath, bitrate = "10k", res, preset = "veryslow", videoEncoder = "libx264", outputOverride = true, pass, extraCommand, hlsOptions } = props;

	const outputFolder = path.parse(outputPath).dir;
	await creathFolder(outputFolder);

	// const commandArr = ["ffmpeg"];
	const commandArr = [ffmpeg_static_path];

	if (outputOverride) {
		commandArr.push("-y");
	}

	if (inputPath) {
		commandArr.push(`-i ${inputPath}`);
	}

	if (bitrate) {
		commandArr.push(`-b:v ${bitrate} -bufsize ${bitrate}`);
	}

	if (res) {
		commandArr.push(`-vf scale=-2:${res}`);
	}

	if (videoEncoder) {
		commandArr.push(`-c:v ${videoEncoder}`);
	}

	if (pass) {
		commandArr.push(`-pass ${pass.index} -passlogfile ${pass.logPath}`);
	}

	if (preset) {
		commandArr.push(`-preset ${preset}`);
	}

	if (hlsOptions && pass.index === 2) {
		commandArr.push(hlsOptions);
	}

	if (extraCommand) {
		commandArr.push(extraCommand);
	}

	if (outputPath) {
		commandArr.push(` ${outputPath}`);
	}

	await spawnExec(commandArr.join(" "));
}

exports.processVideo = async (props) => {
	const { outputPath } = props;
	const outputFolder = path.parse(outputPath).dir;

	const logpath = `ffmpeglog-pass-${randomUUID()}`;
	console.log("FIRST PASS STARTED");
	await processVideoSingle({ ...props, pass: { index: 1, logPath: logpath }, outputPath: "-an -f null /dev/null" });
	console.log("FIRST PASS ENDED");
	console.log("SECOND PASS STARTED");
	await processVideoSingle({ ...props, pass: { index: 2, logPath: logpath } });
	console.log("SECOND PASS ENDED");

	console.log("removing log file :: ");
	removeFile(`${logpath}-0.log`);
	removeFile(`${logpath}-0.log.mbtree`);
};
