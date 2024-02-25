"use strict";

const { spawnExec } = require("./spawnUtil");

async function processVideoSingle(props, stdProps = {}) {
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
		commandArr.push(`-pass ${pass}`);
	}

	if (preset) {
		commandArr.push(`-preset ${preset}`);
	}

	if (outputPath) {
		commandArr.push(` ${outputPath}`);
	}

	const spawnInst = spawnExec(commandArr.join(" "));
	const { outputLog = true } = stdProps;

	if (outputLog) {
		spawnInst.stdout.on("data", (data) => {
			console.log(`${data}`);
		});
		spawnInst.stderr.on("data", (data) => {
			console.log(`${data}`);
		});
	}

	// Handling the completion of the command

	return new Promise((res, rej) => {
		spawnInst.on("close", (code) => {
			console.log(`child process exited with code ${code}`);
			if (code == 0) return res(code);
			return rej(code);
		});
	});
}

exports.processVideo = async (props) => {
	console.log("FIRST PASS STARTED");
	await processVideoSingle({ ...props, pass: 1, outputPath: "-an -f null /dev/null" });
	console.log("FIRST PASS ENDED");
	console.log("SECOND PASS STARTED");
	processVideoSingle({ ...props, pass: 2 });
	console.log("SECOND PASS ENDED");
};
