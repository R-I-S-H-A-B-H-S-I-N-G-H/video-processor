// shellUtil.js
const { exec } = require("child_process");
const { Worker, isMainThread, parentPort, workerData, threadId } = require("worker_threads");

if (isMainThread) {
	exports.executeWorker = (command) => {
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
	const child = exec(command);
	console.log("STARTING");

	// child.stdout.on('data', (data) => {
	//     console.log(`stdout: ${data}`);
	// });

	// child.stderr.on('data', (data) => {
	//     console.error(`stderr: ${data}`);
	// });

	child.on("error", (error) => {
		console.error(`error: ${error.message}`);
	});

	child.on("close", (code) => {
		console.log(`child process exited with code ${code}`);
		parentPort.postMessage("OUT MESSAGE");
	});
}
