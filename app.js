var express = require("express");
const fs = require("fs");

const app = express();

app.get("/", (req, res) => {
  res.send("/index.html");
});

app.listen(3006, () => {
  console.log("Server started on port 3006.");
});
