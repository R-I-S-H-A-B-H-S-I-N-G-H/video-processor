const { processVideo } = require("./utils/ffmpegUtil");

const { putObject } = require("./utils/awsUtil");
const fs = require("fs");
const path = require("path");
const { getFolderContent } = require("./utils/unixUtil");

const props = {
	inputPath: "test.mp4",
	outputPath: "test/out.m3u8",
	bitrate: "200K",
	res: 360,
	hlsOptions: "-f hls -hls_time 1 -hls_playlist_type vod",
};
processVideo(props);
// const readstream = fs.createReadStream(path.resolve(__dirname, "test/out.m3u8"));
// putObject("sample/tests1.m3u8", readstream);

// async function uploadFolderTos3(folderAbsPath, upfoldername) {
// 	const filesArr = await getFolderContent(folderAbsPath);
// 	const promiseArr = [];
// 	for (let filepath of filesArr) {
// 		const fileObj = path.parse(filepath);
// 		const filename = fileObj.name + fileObj.ext;
// 		console.log(filename);
// 		const readstream = fs.createReadStream(filepath);
// 		const promise = putObject(`${upfoldername}/${filename}`, readstream);
// 		promiseArr.push(promise);
// 		console.log(`https://s3.us-east-005.backblazeb2.com/vid-s3/hls/${filename}`);
// 	}
// 	await Promise.all(promiseArr);
// }
// uploadFolderTos3(path.resolve(__dirname, "test"), "testhls2");
