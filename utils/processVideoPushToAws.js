const { processVideo } = require("../utils/ffmpegUtil");
const { uploadFolderToS3, putObject } = require("../utils/awsUtil");
const path = require("path");
const fs = require("fs");
const { removeFolder, downloadFile, creathFolder, writeFile } = require("../utils/unixUtil");
const { randomUUID } = require("crypto");
exports.processVideoAndPushToAws = async (props) => {
	const { outputFileName, res } = props || {};
	const baseDir = path.join(__dirname, "temp", randomUUID());
	const s3UpPath = outputFileName.split(".").shift();
	try {
		await creathFolder(path.join(__dirname, "temp"));
		await creathFolder(baseDir);
		props.outputPath = path.join(baseDir, `${path.parse(outputFileName).name}/${res}.m3u8`);
		console.log(props.outputPath);
		props.inputPath = path.join(baseDir, `download/input.mp4`);
		props.hlsOptions = "-f hls -hls_time 1 -hls_playlist_type vod";
		await downloadFile(props.s3Url, path.resolve(__dirname, props.inputPath));
		await processVideo(props);
		await uploadFolderToS3(s3UpPath, path.dirname(props.outputPath));
		removeFolder(baseDir);
		removeFolder(path.dirname(props.outputPath));
		removeFolder(path.dirname(props.inputPath));
	} catch (error) {
		console.log(error);
	}
};

exports.generateMasterHlsFile = async (outputFileName) => {
	const baseDir = path.join(__dirname, randomUUID());
	const fileAbspath = path.join(baseDir, `/master.m3u8`);
	const fileContent = `#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=375000,RESOLUTION=640x360\n360.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=750000,RESOLUTION=854x480\n480.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720\n720.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=3500000,RESOLUTION=1920x1080\n1080.m3u8`;
	const s3UpPath = outputFileName.split(".").join("/abr.");
	try {
		await creathFolder(baseDir);
		writeFile(fileAbspath, fileContent);
		console.log();
		const awsresp = await putObject(s3UpPath, fs.createReadStream(fileAbspath));
		removeFolder(baseDir);
	} catch (error) {}
};

exports.generateAdaptiveBitrateHls = async (props) => {
	await this.generateMasterHlsFile(props.outputFileName);
	await this.processVideoAndPushToAws({ ...props, bitrate: "100k", res: 360 });
	await this.processVideoAndPushToAws({ ...props, bitrate: "400k", res: 480 });
	await this.processVideoAndPushToAws({ ...props, bitrate: "800k", res: 720 });
	await this.processVideoAndPushToAws({ ...props, bitrate: "1600k", res: 1080 });
};
