const { MongoClient } = require("mongodb");
const delay = require("delay");
require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const postForm = async (req, res) => {
  const { email } = req.body;
  await delay(Math.random() * 3000);
  //   if (!email.includes("@")) {
  //     return res.status(400).json({
  //       status: "error",
  //       error: "missing-data",
  //     });
  //   }

  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Cosmic_NRG");

  try {
    await client.connect();
    await db.collection("forms").insertOne({
      ...req.body,
    });
    return res.status(200).json({
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { postForm };
