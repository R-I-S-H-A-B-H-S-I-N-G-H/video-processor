const { processVideo } = require("./utils/ffmpegUtil");

const { putObject, uploadFolderToS3 } = require("./utils/awsUtil");
const fs = require("fs");
const path = require("path");
const { getFolderContent, removeFolder } = require("./utils/unixUtil");

(async () => {
	const props = {
		inputPath: "test.mp4",
		outputPath: path.join(__dirname, "300/360.m3u8"),
		bitrate: "200K",
		res: 360,
		hlsOptions: "-f hls -hls_time 1 -hls_playlist_type vod",
	};
	// await processVideo(props);
	// await uploadFolderToS3(path.dirname(props.outputPath));
	removeFolder(path.dirname(props.outputPath));
	// await putObject("test.mp4", fs.createReadStream(props.outputPath));
})();
