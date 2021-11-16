//AnotherMe:password,Me:MyPass,Radu:password,Jyri:1234,Petri:p3tri
const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const handleError = (err, response) => {
    response.status(404).json(err);
};

// not used in web app
router.get("/", (request, response) => {
    db.getAllUsers(
        (err) => {
            handleError(err, response);
        },
        (users) => {
            response.json(users);
        }
    );
});

// not used in web app
router.get("/:id", (request, response) => {
    const id = request.params.id;
    db.getUser(
        id,
        (err) => {
            handleError(err, response);
        },
        (user) => {
            response.json(user);
        }
    );
});

router.post("/", async (request, response) => {
    request.body.password = await bcrypt.hash(request.body.password, 10);

    db.addUser(
        request.body,
        (err) => {
            handleError(err, response);
        },
        (status) => {
            db.getUser(
                status.insertId,
                (err) => {
                    handleError(err, response);
                },
                (resultArray) => {
                    const token = jwt.sign(
                        {
                            username: resultArray[0]["Name"],
                            id: resultArray[0]["ID"],
                        },
                        process.env.SECRET
                    );
                    delete resultArray[0]["Password"];
                    resultArray[0]["Token"] = token;
                    response.json(resultArray[0]);
                }
            );
        }
    );
});

module.exports = router;
