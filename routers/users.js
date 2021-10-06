const db = require("../db.js");
const routerUser = require("express").Router();

const handleError = (err, response) => {
    // this will need to support multiple status codes
	response.status(404).json(err);
};

routerUser.get("/", (request, response) => {
	db.getAllUsers(
        (err) => {
			handleError(err, response);
		},
		(users) => {
			response.json(users);
		}
	);
});

routerUser.get("/:id", (request, response) => {
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

routerUser.post("/", (request, response) => {
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
                (user) => {
                    response.json(user);
                }
            );
        }
    );
});

module.exports = routerUser;