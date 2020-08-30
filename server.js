const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db = require("./config/database.config.js");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan("dev"));

mongoose.Promise = global.Promise;
mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  //testing
  res.json("Welcome to Green-Core Mobile App backend - testing  ");
});

// routes
const userRoutes = require("./app/routes/user.routes");
const plantRoutes = require("./app/routes/plant.routes");
const unitRoutes = require("./app/routes/unit.routes");
const chatRoutes = require("./app/routes/chat.routes") 
const notificationRoutes = require("./app/routes/notification.routes") 
const tipsRoutes = require("./app/routes/tips.routes") 
 

// Use Routes
app.use("/users", userRoutes);
app.use("/units", unitRoutes);
app.use("/plants", plantRoutes);
app.use("/chats", chatRoutes) 
app.use("/notifications", notificationRoutes) 
app.use("/tips", tipsRoutes) 





app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
