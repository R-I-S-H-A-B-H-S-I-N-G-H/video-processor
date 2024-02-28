"use strict";
const { spawnExec } = require("./spawnUtil");
const { readdir } = require("fs");
const path = require("path");

exports.creathFolder = (folderPath) => {
	return spawnExec(`mkdir ${folderPath}`);
};

exports.removeFolder = (folderPath) => {
	return spawnExec(`mkdir ${folderPath}`);
};

exports.createFile = (filename) => {
	return spawnExec(`cat ${filename}`);
};

exports.removeFile = (filename) => {
	return spawnExec(`rm ${filename}`);
};

exports.getFolderContent = (folderAbsPath) => {
	return new Promise((res, rej) => {
		readdir(folderAbsPath, (err, data) => {
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
