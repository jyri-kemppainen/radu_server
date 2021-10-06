const express = require("express");
const cors = require("cors");

const server = express();
server.use(cors()); // middleware
server.use(express.json()); // middleware

const placesRouter = require("./routers/places");
server.use("/api/places", placesRouter);

const userRouter = require("./routers/users");
server.use("/api/users", userRouter);

const port = 3001; 
server.listen(port, (err) => {
    if (err) {
        console.log("Server failed to start!");
    } else {
        console.log("Server is running on port " + port);
    }
});
