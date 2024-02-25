const { processVideo } = require("./utils/ffmpegUtil");

const props = {
	inputPath: "test.mp4",
	outputPath: "out.mp4",
	bitrate: "200K",
	res: 360,
};
processVideo(props);
