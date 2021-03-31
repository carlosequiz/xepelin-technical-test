const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// DB setup
const MongoClient = require("mongodb").MongoClient;
const uri = "YOUR_URI_HERE!!!"
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// App Setup
const app = express();
app.use(cors());

client.connect((err) => {
  const domainCollection = client.db("xepelintest").collection("domains");
  const urlCollection = client.db("xepelintest").collection("urls");

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // * Respond with a list of all the domains registered in the DB.
  // * The domain should not include the protocol but includes subdomains (f.e www.xepelin.com -> xepelin.com)
  app.get("/domain", function (req, res) {
    domainCollection
      .find()
      .sort({ last_updated: -1 })
      .toArray(function (err, result) {
        if (err) throw err;
        res.status(200).send(result);
      });
  });

  // * Respond with a list all the URLs registered to that domain
  app.get("/domain/:id", function (req, res) {
    var id = req.params.id;
    urlCollection.find({ domain_id: id }).toArray(function (err, result) {
      if (err) throw err;
      res.status(200).send(result);
    });
  });

  // * Receives a POST with a url-encoded payload like this: url=http://www.xepelin.com/my-url
  // * If the URL is not registered in the system, it stores the URL along with a unique ID and the domain of the URL
  // * The server sends the ID in the response, using status code 201
  // * If the URL was already in the system, it fetches the ID and sends it with status code 208
  app.post("/shorten", function (req, res) {
    const url = req.body && req.body.url ? req.body.url : undefined;
    const urlObject = new URL(url);
    const hostname = urlObject.hostname;

    // Storing domain
    domainCollection.findOneAndUpdate(
      { name: hostname },
      { $set: { _id: hostname, name: hostname, last_updated: new Date() } },
      { upsert: true },
      function () {}
    );

    // Storing url and returning response according
    urlCollection.findOneAndUpdate(
      { name: url, domain_id: hostname },
      { $set: { name: url, domain_id: hostname } },
      { upsert: true },
      function (err, doc) {
        if (err) {
          throw err;
        } else {
          if (doc.lastErrorObject.updatedExisting) {
            res.status(208).send(doc.value._id);
          } else {
            res.status(201).send(doc.lastErrorObject.upserted);
          }
        }
      }
    );
  });

  // * Receives an ID, fetches the URL from an storage
  // * If it exists, return the given url
  // * If it doesn't, the server responds with status code 404
  app.get("/:id", function (req, res) {
    var id = req.params.id;
    var ObjectId = require("mongodb").ObjectID;

    urlCollection.findOne({ _id: new ObjectId(id) }, function (err, doc) {
      if (err) {
        throw err;
      } else {
        if (doc) {
          res.status(200).send(doc.name);
        } else {
          res.status(404).send();
        }
      }
    });
  });

  app.listen(3003, function () {
    console.log("express shortener url listening to port 3003");
  });
});
