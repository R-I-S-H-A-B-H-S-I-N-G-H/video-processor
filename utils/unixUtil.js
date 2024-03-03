"use strict";
const { spawnExec } = require("./spawnUtil");
const fs = require("fs");
const path = require("path");
const https = require("https");
const dotenv = require("dotenv");
dotenv.config();

exports.creathFolder = (folderPath) => {
	return spawnExec(`mkdir ${folderPath}`);
};

exports.removeFolder = (folderPath) => {
	fs.rmSync(folderPath, { recursive: true, force: true });
};

exports.createFile = (filename) => {
	return spawnExec(`cat ${filename}`);
};

exports.removeFile = (filename) => {
	return spawnExec(`rm ${filename}`);
};

exports.getFolderContent = (folderAbsPath) => {
	return new Promise((res, rej) => {
		fs.readdir(folderAbsPath, (err, data) => {
			if (err) return rej(err);
			const absPathArr = [];
			for (let file of data) {
				const absFilePath = path.resolve(folderAbsPath, file);
				absPathArr.push(absFilePath);
			}
			res(absPathArr);
		});
	});
};

exports.downloadFile = async (remoteUrl, downloadedFileAbsPath) => {
	await this.creathFolder(path.dirname(downloadedFileAbsPath));
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(downloadedFileAbsPath);

		https
			.get(remoteUrl, (response) => {
				response.pipe(file);
				file.on("finish", () => {
					file.close(resolve);
				});
			})
			.on("error", (error) => {
				fs.unlink(destinationPath, () => reject(error));
			});
	});
};

exports.writeFile = async (filePathAbs, data) => {
	return new Promise((res, rej) => {
		fs.writeFile(filePathAbs, data, (err) => {
			if (err) {
				return rej(err);
			}
			res({ msg: "Content written to file successfully!" });
		});
	});
};

exports.env = process.env.ENV == "DEV" ? "DEV" : "PROD";
exports.RootDir = this.env == "DEV" ? path.parse(__dirname).dir : "/tmp";
