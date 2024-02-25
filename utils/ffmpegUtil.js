"use strict";

const { spawnExec } = require("./spawnUtil");
const { randomUUID } = require("crypto");
const { removeFile } = require("./unixUtil");

async function processVideoSingle(props) {
	const { inputPath, outputPath, bitrate = "10k", res, preset = "veryslow", videoEncoder = "libx264", outputOverride = true, pass } = props;
	const commandArr = ["ffmpeg"];

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

	if (outputPath) {
		commandArr.push(` ${outputPath}`);
	}

	await spawnExec(commandArr.join(" "));
}

exports.processVideo = async (props) => {
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
