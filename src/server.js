const express = require("express");
const app = express();
const port = 3007;
const db = require("./db_config");
const cors = require("cors");

app.use(express.json());
app.use(cors());