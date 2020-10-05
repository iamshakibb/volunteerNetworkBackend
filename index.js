const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 8000;
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@noteit.yjcnh.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
  const volunteersActivitiesCollection = client.db(`${process.env.DB_Name}`).collection("volunteersActivist");
  const userActivityCollection = client.db(`${process.env.DB_Name}`).collection("userActivity");

  // send all voluntary activities to mongodb
  app.post("/sendVolunteersActivities", cors(), (req, res) => {
    const volunteersActivistData = req.body;
    volunteersActivitiesCollection.insertMany(volunteersActivistData).then(() => {
      res.end;
    });
  });

  // get all voluntary activities to mongodb
  app.get("/getVolunteersActivities", cors(), (req, res) => {
    volunteersActivitiesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // send user activities to mongodb
  app.post("/sendUserActivities", cors(), (req, res) => {
    const userActivities = req.body;
    userActivityCollection.insertOne(userActivities).then(() => {
      res.end;
    });
  });

  // get user activities from mongodb
  app.get("/getUserActivities", cors(), (req, res) => {
    userActivityCollection.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // delete user activities from mongodb
  app.delete("/delete/UserActivities/:id", cors(), (req, res) => {
    console.log(req.params.id);
    userActivityCollection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      console.log(result);
    });
  });

  // get all user activities from mongodb
  app.get("/usersActivities", cors(), (req, res) => {
    userActivityCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.get("/", cors(), (req, res) => {
  res.send("SHIHABUN SHAKIB");
});

app.listen(process.env.PORT || port);
