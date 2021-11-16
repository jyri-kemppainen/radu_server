const server = require("./index");
require('dotenv').config();

const port = process.env.PORT; 
server.listen(port, (err) => {
    if (err) {
        console.log("Server failed to start!");
    } else {
        console.log("Server is running on port " + process.env.PORT);
    }
});