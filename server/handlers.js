const path = require("path");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: "../.env" });
const { MONGO_URI } = process.env;
const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: "dzeqhgz6k",
  api_key: "964815125465362",
  api_secret: "BQyor-8nnYYbmXo1jsa5G4ANZTI",
  secure: true,
});
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Forms modification
const getForms = async (request, response) => {
  try {
    const client = await MongoClient.connect(MONGO_URI, {
      useUnifiedTopology: true,
    });
    const dbName = client.db("Cosmic_NRG");

    const data = await dbName.collection("forms").find().toArray();

    client.close();
    return response.status(200).json({ status: 200, data: data });
  } catch (error) {
    return response
      .status(500)
      .json({ status: 500, message: "Server Error, " + error.message });
  }
};
const getSingleForm = async (request, response) => {
  try {
    const { _id } = request.params;
    const client = await MongoClient.connect(MONGO_URI, {
      useUnifiedTopology: true,
    });
    const dbName = client.db("Cosmic_NRG");
    const query = { _id: _id };
    const data = await dbName.collection("forms").findOne(query);
    console.log(data);
    client.close();
    return response.status(200).json({ status: 200, data: data });
  } catch (error) {
    return response
      .status(500)
      .json({ status: 500, message: "Server Error, " + error.message });
  }
};

const postNewForm = async (request, response) => {
  try {
    const { type, formData } = request.body;

    console.log("request.body", request.body);

    const client = await MongoClient.connect(MONGO_URI);
    const dbName = client.db("Cosmic_NRG");

    // Create a Date object with the current date and time
    const now = new Date();
    const timestamp = now.getTime();

    const addForm = {
      formData,
      type,
      status: "pending",
      comment: [],
      _id: uuidv4(),
      date: timestamp,
    };

    // create form
    const newForm = await dbName.collection("forms").insertOne(addForm);
    client.close();
    return response.status(200).json({
      status: 200,
      message: "success",
    });
  } catch (error) {
    return response
      .status(500)
      .json({ status: 500, message: "Server Error, " + error.message });
  }
};

const deleteForm = async (req, res) => {
  const id = req.params.forms;
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Cosmic_NRG");
  try {
    await client.connect();
    const form = await db.collection("forms").findOne({ id });
    if (!form) {
      return res.status(404).json({ status: 404, message: "Form not found" });
    }
    await db.collection("forms").deleteOne({ id });
    client.close();
    return res.status(200).json({
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const markAsResolved = async (request, response) => {
  const { id } = request.params;
  console.log(id);
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("Cosmic_NRG");
    const form = await db.collection("forms").findOne({ _id: id });
    console.log(form);
    if (!form) {
      client.close();
      return response
        .status(404)
        .json({ status: 404, message: "Reservation not found" });
    }
    await db
      .collection("forms")
      .updateOne({ _id: id }, { $set: { status: "resolved" } });

    client.close();
    return response.status(200).json({
      status: 200,
      message: "successfully modified ",
    });
  } catch (error) {
    return response

      .status(500)
      .json({ status: 500, message: "Server Error: " + error.message });
  }
};

const updateForm = async (req, res) => {
  const { updatedfirstName, updatedLastName, updatedEmail, updatedSeat } =
    req.body;
  const _id = req.params.reservation;
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("slingshot");
  try {
    await client.connect();
    const reservation = await db.collection("reservations").findOne({ _id });

    if (!reservation) {
      client.close();
      return res
        .status(404)
        .json({ status: 404, message: "Reservation not found" });
    }
    const newFirstName = updatedfirstName
      ? updatedfirstName
      : reservation.firstName;
    const newLastName = updatedLastName
      ? updatedLastName
      : reservation.lastName;
    const newEmail = updatedEmail ? updatedEmail : reservation.email;
    const newSeat = updatedSeat ? updatedSeat : reservation.seat;

    console.log(updatedSeat);
    if (updatedSeat) {
      const updatePastSeat = await db.collection("flights").updateOne(
        {
          flight: reservation.flight,
          "seats.id": reservation.seat,
        },

        { $set: { "seats.$.isAvailable": true } }
      );
      const updateNewSeat = await db.collection("flights").updateOne(
        {
          flight: reservation.flight,
          "seats.id": updatedSeat,
        },

        { $set: { "seats.$.isAvailable": false } }
      );
    }
    await db.collection("reservations").updateOne(
      { _id: reservation._id },
      {
        $set: {
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          seat: newSeat,
        },
      }
    );

    client.close();
    return res.status(200).json({
      status: 200,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// Admin users
const handleUser = async (req, res) => {
  const user = req.body;

  const currentUser = new MongoClient(MONGO_URI, options);
  const db = client.db("CosmicNRG");
  try {
    await client.connect();
    const userEntry = await db
      .collection("users")
      .findOne({ email: user.email });

    if (!userEntry) {
      await db.collection("users").insertOne(user);
      res.status(200).json({ status: 200, message: "User added to database" });
    } else {
      res.status(400).json({ status: 400, message: "User exists" });
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ status: 500, error: error.stack });
  }
};
// Post Comment
const createComment = (status, { isRetweet }) => {
  const newTweetId = Math.random() * 10 ** 18;
  const timestamp = new Date().toISOString();

  let sharedTweetBasics = {
    _id: newTweetId,
    authorHandle: CURRENT_USER_HANDLE,
    timestamp,
    sortedTimestamp: timestamp,
  };
};

module.exports = {
  postNewForm,
  deleteForm,
  markAsResolved,
  updateForm,
  getForms,
  handleUser,
  getSingleForm,
};
