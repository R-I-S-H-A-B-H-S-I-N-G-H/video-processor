"use strict";

const { spawnExec } = require("./spawnUtil");
const { randomUUID } = require("crypto");
const { removeFile, creathFolder } = require("./unixUtil");
const path = require("path");

async function processVideoSingle(props) {
	const { inputPath, outputPath, bitrate = "10k", res, preset = "veryslow", videoEncoder = "libx264", outputOverride = true, pass, extraCommand } = props;

	const outputFolder = path.parse(outputPath).dir;
	await creathFolder(outputFolder);

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
	if (extraCommand) {
		commandArr.push(extraCommand);
	}

	if (outputPath) {
		commandArr.push(` ${outputPath}`);
	}

	await spawnExec(commandArr.join(" "));
}

/**
 * ffmpeg -i test.mp4 -c:v libx264 -b:v 100k -pass 1 -an -f null /dev/null
 *  && 
 * ffmpeg -i test.mp4 -c:v libx264 -b:v 100k -pass 2 -c:a aac -f hls -hls_time 10 -hls_playlist_type vod test/output.m3u8


ffmpeg -i test.mp4 -b:v 100k -bufsize 100k -vf scale=-2:360 -c:v libx264 -pass 1 -preset veryslow -an -f null /dev/null 
&&
ffmpeg -i test.mp4 -c:v libx264 -b:v 100k -bufsize
100k -vf scale=-2:360 -pass 2 -preset veryslow
-c:a aac -f hls -hls_time 10 -hls_playlist_type
vod test/output.m3u8




 ffmpeg -i test.mp4 -b:v 100k -bufsize 100k -vf scale=-2:360 -c:v libx264 -pass 1 -preset veryslow -an -f null /dev/null
  &&
ffmpeg -y -i test.mp4 -b:v 200K -bufsize 100 -vf scale=-2:360 -c:v libx264 -pass 2 -passlogfile
ffmpeglog-pass-62ba4da6-d901-447c-af9e-4ab4cedd4fc8
-preset  veryslow test/out.m3u8


 ffmpeg -y -i test.mp4 -b:v 100k -bufsize 100k -vf scale=-2:360 -c:v libx264 -pass 1 -passlogfile ffmpeglog-pass-bea0121e-e576-463a-9015-a2c3dabdde3c -preset veryslow -an -f null /dev/null

 * 
 */
exports.processVideo = async (props) => {
	const logpath = `ffmpeglog-pass-${randomUUID()}`;
	console.log("FIRST PASS STARTED");
	await processVideoSingle({ ...props, pass: { index: 1, logPath: logpath }, outputPath: "-an -f null /dev/null" });
	console.log("FIRST PASS ENDED");
	console.log("SECOND PASS STARTED");
	await processVideoSingle({ ...props, pass: { index: 2, logPath: logpath }, extraCommand: "-f hls -hls_time 1 -hls_playlist_type vod" });
	console.log("SECOND PASS ENDED");

	console.log("removing log file :: ");
	// removeFile(`${logpath}-0.log`);
	// removeFile(`${logpath}-0.log.mbtree`);
};
