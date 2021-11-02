const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Store = require("api/models/store");
const StoreService = require("api/services/storeService");
const storeService = new StoreService();
require("dotenv").config();

// allow to retrieve list of store from API

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// "mongodb+srv://chanqo_dev:pCeo4OvKIAAbOwmW@cluster0.3njeu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
mongoose.connect(
  "mongodb+srv://chanqo_dev:pCeo4OvKIAAbOwmW@cluster0.3njeu.mongodb.net/cluster0?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);
// body parser middleware has been deprecated!
app.use(
  express.json({
    limit: "50mb",
  })
);

app.get("/api/stores", (req, res) => {
  const zipCode = req.query.zip_code;
  storeService
    .getStoresNear(zipCode)
    .then((stores) => {
      res.status(200).send(stores);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/api/stores", (req, res) => {
  const stores = req.body.stores;
  let dbStores = [];
  for (const store of stores) {
    dbStores.push({
      _id: new mongoose.Types.ObjectId(),
      storeName: store.name,
      phoneNumber: store.phoneNumber,
      address: store.address,
      openStatusText: store.openStatusText,
      addressLines: store.addressLines,
      location: {
        type: "Point",
        coordinates: [Store.coordinates.longitude, Store.coordinates.latitude],
      },
    });
  }
  Store.create(dbStores, (err, stores) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(stores);
    }
  });
});

app.delete("/api/stores", (req, res) => {
  Store.deleteMany({}, (result) => {
    res.status(200).send(result);
  });
});

app.listen(3000, () => console.log("Listening on http://localhost:3000/"));
