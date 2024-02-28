const { ListBucketsCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();

exports.putObject = async (key, content) => {
	const BUCKET = process.env.BUCKET;
	const S3_END_POINT = process.env.S3_END_POINT;
	const credentials = {
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
	};
	const s3Client = new S3Client({
		endpoint: S3_END_POINT,
		credentials: credentials,
		region: process.env.REGION,
	});
	const props = {
		Bucket: BUCKET,
		Key: key,
		Body: content,
	};

	try {
		const res = await s3Client.send(new PutObjectCommand(props));
		console.log(res);
	} catch (error) {
		console.error("ERROR: ", error);
	}
};
