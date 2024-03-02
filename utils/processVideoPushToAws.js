const { processVideo } = require("../utils/ffmpegUtil");
const { uploadFolderToS3 } = require("../utils/awsUtil");
const path = require("path");
const { removeFolder, downloadFile, creathFolder } = require("../utils/unixUtil");
const { randomUUID } = require("crypto");
exports.processVideoAndPushToAws = async (props) => {
	const { outputFileName, res } = props || {};
	const baseDir = path.join(__dirname, randomUUID());

	try {
		await creathFolder(baseDir);
		props.outputPath = path.join(baseDir, `${path.parse(outputFileName).name}/${res}.m3u8`);
		props.inputPath = path.join(baseDir, `download/input.mp4`);
		props.hlsOptions = "-f hls -hls_time 1 -hls_playlist_type vod";
		await downloadFile(props.s3Url, path.resolve(__dirname, props.inputPath));
		await processVideo(props);
		await uploadFolderToS3(path.dirname(props.outputPath));
		removeFolder(baseDir);
		removeFolder(path.dirname(props.outputPath));
		removeFolder(path.dirname(props.inputPath));
	} catch (error) {
		console.log(error);
	}
};
