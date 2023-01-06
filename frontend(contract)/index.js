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

global.adminAuth = admin.auth();

app.use("/api/user", require("./server/routes/api/user"));

// app.use(express.static('public'));
// app.use(express.json());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//   next();
// });

// // error handling middleware
// app.use(function(err,req,res,next){
//     res.status(422).send({error: err.message});
// });

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
