const { processVideo } = require("./utils/ffmpegUtil");

const props = {
	inputPath: "test.mp4",
	outputPath: "out.mp4",
	bitrate: "200K",
	res: 360,
};
processVideo(props);
processVideo({ ...props, outputPath: "out2.mp4", bitrate: "10K", res: 720 });
