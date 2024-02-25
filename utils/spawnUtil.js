"use strict";
// shellUtil.js
const { exec, spawn } = require("child_process");

exports.spawnExec = (command) => {
	if (typeof command !== "string") return;
	const commandArr = command.split(" ").filter((ele) => ele.length != 0);
	const mainCommand = commandArr.shift();
	const argsArr = commandArr;

	console.log("COMMAND EXEC :: ", mainCommand, argsArr.join(" "));
	const spawnInst = spawn(mainCommand, argsArr);
	return spawnInst;
	// Handling data from the command
	// spawnInst.stdout.on("data", (data) => {
	// 	console.log(`${data}`);
	// });

	// spawnInst.stderr.on("data", (data) => {
	// 	console.error(`${data}`);
	// });

	// // Handling the completion of the command
	// spawnInst.on("close", (code) => {
	// 	console.log(`child process exited with code ${code}`);
	// 	if (code == 0) return res(code);
	// 	return rej(code);
	// });
};
