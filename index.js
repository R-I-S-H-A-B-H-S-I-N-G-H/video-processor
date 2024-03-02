const { processVideo } = require("./utils/ffmpegUtil");

const { putObject, uploadFolderToS3 } = require("./utils/awsUtil");
const fs = require("fs");
const path = require("path");
const { getFolderContent } = require("./utils/unixUtil");

(async () => {
	const props = {
		inputPath: "test.mp4",
		outputPath: "output/360.m3u8",
		bitrate: "200K",
		res: 360,
		hlsOptions: "-f hls -hls_time 1 -hls_playlist_type vod",
	};
	await uploadFolderToS3("testvid");
	// await processVideo(props);
	// await putObject("test.mp4", fs.createReadStream(props.outputPath));
})();
