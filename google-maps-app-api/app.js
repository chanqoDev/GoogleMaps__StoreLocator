const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const Store = require("./api/models/store");

mongoose.connect(
  "mongodb+srv://chanqo_dev:pCeo4OvKIAAbOwmW@cluster0.3njeu.mongodb.net/cluster0?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// body parser middleware has been deprecated!
app.use(express.json({ limit: "50mb" }));

app.post("/api/stores", (req, res) => {
  let dbStores = req.body;
  console.log(dbStores);
  var store = new Store({
    storeName: "Test",
    phoneNumber: "9493840248",
    location: {
      type: "Point",
      coordinates: [-118.376354, 34.063584],
    },
  });
  store.save();
  res.send("You have posted");
});

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
