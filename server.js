const express = require("express");
const app = express();
const path = require("path");

const port = process.env.PORT || 5000;
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "index.html"));
});

app.listen(port, () => {
  console.log(`app serving on port ${port}`);
});
