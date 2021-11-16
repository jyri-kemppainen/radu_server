const express = require("express");
const cors = require("cors");

const server = express();
server.use(express.static('./client/build')) // react client starts from host url
server.use(cors()); // middleware
server.use(express.json()); // middleware

const placesRouter = require("./routers/places");
server.use("/api/places", placesRouter);

const userRouter = require("./routers/users");
server.use("/api/users", userRouter);

const loginRouter = require("./routers/login");
server.use("/api/login", loginRouter);

module.exports = server; 