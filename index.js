const { processVideo } = require("./utils/ffmpegUtil");

const props = {
	inputPath: "test.mp4",
	outputPath: "out.mp4",
	bitrate: "200K",
	res: 360,
};

for (let i = 0; i < 1; i++) {
	processVideo({ ...props, outputPath: `out${i}.mp4`, bitrate: "100K", res: 320 });
}
