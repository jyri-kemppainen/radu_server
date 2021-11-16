const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = require("express").Router();

const handleError = (err, response, code = 404) => {
    response.status(code).json(err);
};

router.post("/", async (request, response) => {
    const name = request.body.name;
    const password = request.body.password;

    db.getUserByName(
        name,
        (err) => {
            handleError(err, response);
        },
        async (status) => {
            if (status.length == 0) {
                handleError({ err: "username does not exist" }, response,401);
            } else {
              if (await bcrypt.compare(password, status[0]["Password"])) {
                    const token = jwt.sign(
                        {
                            username: name,
                            id: status[0]["ID"],
                        },
                        process.env.SECRET
                    );
                    delete status[0]["Password"];
                    status[0]["Token"] = token;
                    response.json(status[0]);
                } else {
                    handleError({ err: "wrong password" }, response,401);
                }
            }
        }
    );
});

module.exports = router;
