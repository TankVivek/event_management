const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./db/config"); // Import the connectDB function
const cors = require("cors");
const upload = require("./utils/multer"); // Include multer configuration
const PORT = process.env.PORT || 5000;
const app = express();

// Connect to the database
connectDB();

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/uploads")); // Serve uploaded images

app.use(bodyParser.json({ limit: "5gb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", require("./router/authRouter"));
app.use("/api", require("./router/eventRouter")); 

app.get("/", (req, res) => res.send("Server is online."));
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
