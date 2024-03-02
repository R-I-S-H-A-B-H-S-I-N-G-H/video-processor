const { processVideo } = require("./utils/ffmpegUtil");

const { putObject, uploadFolderToS3 } = require("./utils/awsUtil");
const fs = require("fs");
const path = require("path");
const { getFolderContent, removeFolder, downloadFile } = require("./utils/unixUtil");

(async () => {
	const props = {
		s3Url: "https://vid-s3.s3.us-east-005.backblazeb2.com/test1.mp4",
		inputPath: "download/input.mp4",
		outputPath: path.join(__dirname, "280/360.m3u8"),
		bitrate: "100k",
		res: 280,
		hlsOptions: "-f hls -hls_time 1 -hls_playlist_type vod",
	};
	await downloadFile(props.s3Url, path.join(__dirname, props.inputPath));
	await processVideo(props);
	await uploadFolderToS3(path.dirname(props.outputPath));
	removeFolder(path.dirname(props.outputPath));
	removeFolder(path.dirname(props.inputPath));
})();
// https://vid-s3.s3.us-east-005.backblazeb2.com/test1.mp4
