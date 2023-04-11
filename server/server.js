const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { join } = require("path");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const cloudinary = require("cloudinary").v2;
const MONGO_URI = process.env.MONGO_URI;
const PORT = 8000;
const app = express();
const {
  postNewForm,
  deleteForm,
  markAsResolved,
  updateForm,
  getForms,
  handleUser,
  getSingleForm,
} = require("./handlers");
app.use(express.json());

app.use(morgan("dev"));

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// app.use(express.static(join(__dirname, "build")));
//works
app.get("/getForms", getForms);
app.get("/getForm/:_id", getSingleForm);
app.delete("/deleteForm/:id", deleteForm);
//dont work
app.post("/postForm", postNewForm);
app.patch("/resolved/:id", markAsResolved);
app.patch("/modifyForm/:id", updateForm);
app.post("/addUser", handleUser);
// app.get("/api/account", getAccounts);
// app.get("/api/account/:id", getAccountById);
// app.post("/api/signin", loginAccount);
// app.patch("/api/friends", handleFriends);

// Serve static assets from the /public folder
// app.use(express.static(join(__dirname, "public")));

// Endpoint to serve the configuration file
// app.get("/auth_config.json", (req, res) => {
//   res.sendFile(join(__dirname, "auth_config.json"));
// });

// Serve the index page for all other requests
// app.get("/*", (_, res) => {
//   res.sendFile(join(__dirname, "index.html"));
// });
app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "This is obviously not what you are looking for.",
  });
});

app.listen(PORT, () => console.log(`Listening on port 8000`));
