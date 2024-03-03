const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const processVideo = require("./routes/processVideo");

// Parse JSON bodies for API requests
app.use(express.json());

// Parse URL-encoded bodies for form data
app.use(express.urlencoded({ extended: true }));

app.use("/videoProcessor", processVideo);
app.get("/test", (req, res) => {
	const fs = require("fs");
	const path = require("path");
	// Data you want to write to the file
	const data = "This is the content of the file.";

	// File path in the /tmp directory
	const filePath = path.join(__dirname, `/tmp/example-${Math.random()}.txt`);

	try {
		// Write the data to the file
		fs.writeFileSync(filePath, data);

		console.log("File written successfully:", filePath);
		res.json({ RES: "CREATED FILE" });
	} catch (err) {
		console.error("Error writing file:", err);
		throw err;
	}
});
app.listen(PORT, () => {
	console.log(`APP LISTING AT PORT ${PORT}`);
});
