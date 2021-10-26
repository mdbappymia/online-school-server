const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.port || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iuevi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    console.log("database connected");
    const database = client.db("online_school");
    const courseCollection = database.collection("courseCollection");

    // get api all courses

    app.get("/courses", async (req, res) => {
      const result = await courseCollection.find({}).toArray();
      res.json(result);
    });

    // get single courses
    app.get("/courses/:id", async (req, res) => {
      const courseId = req.params.id;
      console.log(courseId);
      const result = await courseCollection.findOne({
        _id: ObjectId(courseId),
      });
      res.json(result);
    });

    // insert new course
    app.post("/courses", async (req, res) => {
      const course = req.body;
      const result = await courseCollection.insertOne(course);
      console.log(result);
      res.json(result);
    });

    // delete a course
    app.delete("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await courseCollection.deleteOne(query);
      res.json(result);
    });

    // update a course

    app.put("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: data,
      };
      const result = await courseCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log("server is running");
});
