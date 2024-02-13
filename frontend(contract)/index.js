const express = require("express");
const PORT = process.env.PORT || 5000;
const path = require("path");
const cors = require("cors");
const admin = require("firebase-admin");
// set up our express app
const app = express();

app.use(cors());
app.use(express.json({ extended: false }));

const credentials = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

app.use("/api/user", require("./server/routes/api/user"));
app.use("/api/leaderboard", require("./server/routes/api/leaderboard"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "./build")));
  // Step 2:
  app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
