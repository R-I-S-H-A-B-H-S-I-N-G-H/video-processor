const { ListBucketsCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const { getFolderContent } = require("./unixUtil");
const path = require("path");
const fs = require("fs");

dotenv.config();

function getS3Object() {
	const S3_END_POINT = process.env.S3_END_POINT;
	const credentials = {
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
	};
	return new S3Client({
		endpoint: S3_END_POINT,
		credentials: credentials,
		region: process.env.REGION,
	});
}

exports.getS3Path = (key) => {
	const BUCKET = process.env.BUCKET;
	return `https://${BUCKET}.s3.us-east-005.backblazeb2.com/${key}`;
};

exports.putObject = async (key, content) => {
	const BUCKET = process.env.BUCKET;
	const s3Client = getS3Object();
	const props = {
		Bucket: BUCKET,
		Key: key,
		Body: content,
	};

	try {
		const res = await s3Client.send(new PutObjectCommand(props));
		res.s3Path = this.getS3Path(key);
		console.log(res);
		return res;
	} catch (error) {
		console.error("ERROR: ", error);
	}
};

exports.uploadFolderToS3 = async (folderpathAbs) => {
	const folderContent = await getFolderContent(folderpathAbs);
	const promiseArr = [];
	for (let filepath of folderContent) {
		const foldername = path.basename(path.dirname(filepath));
		const file = path.parse(filepath);
		const filename = file.base;
		const promise = this.putObject(`${foldername}/${filename}`, fs.createReadStream(filepath));
		promiseArr.push(promise);
	}
	await Promise.all(promiseArr);
};
