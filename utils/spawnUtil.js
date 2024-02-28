"use strict";
// shellUtil.js
const { spawn } = require("child_process");
const { Worker, isMainThread, parentPort, workerData, threadId } = require("worker_threads");

// exports.spawnExec = (command) => {
// 	if (typeof command !== "string") return;
// 	const commandArr = command.split(" ").filter((ele) => ele.length != 0);
// 	const mainCommand = commandArr.shift();
// 	const argsArr = commandArr;

// 	console.log("COMMAND EXEC :: ", mainCommand, argsArr.join(" "));
// 	const spawnInst = spawn(mainCommand, argsArr);
// 	return spawnInst;
// };

if (isMainThread) {
	exports.spawnExec = (command) => {
		return new Promise((resolve, reject) => {
			const worker = new Worker(__filename, {
				workerData: { command },
			});
			worker.on("message", resolve);
			worker.on("error", reject);
			worker.on("exit", (code) => {
				if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
			});
		});
	};
} else {
	const { command } = workerData;

	if (typeof command !== "string") return;
	const commandArr = command.split(" ").filter((ele) => ele.length != 0);
	const mainCommand = commandArr.shift();
	const argsArr = commandArr;

	console.log("COMMAND EXEC :: ", mainCommand, argsArr.join(" "));
	const child = spawn(mainCommand, argsArr);

	child.on("close", (code) => {
		console.log(`child process exited with code ${code}`);
		parentPort.postMessage("OUT MESSAGE");
	});

	child.stdout.on("data", (data) => {
		console.log(`stdout: ${data}`);
	});

	child.stderr.on("data", (data) => {
		console.error(`stderr: ${data}`);
	});
}
