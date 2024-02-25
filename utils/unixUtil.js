"use strict";
const { spawnExec } = require("./spawnUtil");

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
