const express = require("express");
const PORT = 8000;
const app = express();
const { postForm } = require("./handlers");
app.use(express.json());

app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "This is obviously not what you are looking for.",
  });
});
app.post("/contact", postForm);

// app.get("/api/account", getAccounts);
// app.get("/api/account/:id", getAccountById);
// app.post("/api/signin", loginAccount);
// app.patch("/api/friends", handleFriends);
// app.delete("/api/account/:id", deleteAccount);
// Node spins up our server and sets it to listen on port 8000.
app.listen(PORT, () => console.log(`Listening on port 8000`));
