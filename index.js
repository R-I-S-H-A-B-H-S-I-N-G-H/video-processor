const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const processVideo = require("./routes/processVideo");

// Parse JSON bodies for API requests
app.use(express.json());

// Parse URL-encoded bodies for form data
app.use(express.urlencoded({ extended: true }));

app.use("/videoProcessor", processVideo);
app.listen(PORT, () => {
	console.log(`APP LISTING AT PORT ${PORT}`);
});
