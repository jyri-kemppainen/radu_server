const maria = require("mariadb/callback");
/*
const hostName="maria.westeurope.cloudapp.azure.com";
const dbUser="testi";
const dbPassword="mariadb1";
*/
const hostName = "localhost";
const dbUser = "root";
const dbPassword = "";
const dbName = "placesapp";

const sendQuery = (sql, onError, onSuccess, doCommit = false) => {
    const con = maria.createConnection({
        host: hostName,
        user: dbUser,
        password: dbPassword,
        database: dbName,
    });

    con.connect((err) => {
        if (err) {
            onError(err);
        } else {
            con.query(sql, (err, res) => {
                if (err) {
                    onError(err);
                    con.end();
                    return;
                }
                onSuccess(res);
                if (doCommit) {
                    con.commit();
                }
                con.end();
            });
        }
    });
};

//Get all places (same as we did in class),
//but add also the name of the user who created
//the place into the result
const getAllPlaces = (onError, onSuccess) => {
    sendQuery(
        `SELECT Places.*, Users.Name AS UserName 
        FROM Places JOIN Users
        ON Users.ID = Places.UserID`,
        onError,
        onSuccess
    );
};

//Get a specific place, given its ID
const getPlace = (id, onError, onSuccess) => {
    sendQuery(
        `SELECT Places.*, Users.Name AS UserName 
        FROM Places JOIN Users
        ON Users.ID = Places.UserID
        WHERE Places.ID =${id}`,
        onError,
        onSuccess
    );
};

//Get all places belonging to a user (given his / her ID)
const getPlacesOfUser = (userId, onError, onSuccess) => {
    sendQuery(
        `SELECT Places.*, Users.Name AS UserName 
        FROM Places JOIN Users
        ON Users.ID = Places.UserID
        WHERE Users.ID =${userId}`,
        onError,
        onSuccess
    );
};

const addPlace = ({ name, userId, lat, lon }, onError, onSuccess) => {
    sendQuery(
        `INSERT INTO Places 
        (Name, UserID, Latitude, Longitude)
        VALUES
        ('${name}',${userId},${lat},${lon})`,
        onError,
        onSuccess,
        true
    );
};

//Delete a place
const deletePlace = (id, onError, onSuccess) => {
    sendQuery(
        `DELETE FROM Places 
        WHERE ID=${id}`,
        onError,
        onSuccess,
        true
    );
};

//Modify a place (given its ID)
const updatePlace = (id, { name, userId, lat, lon }, onError, onSuccess) => {
    sendQuery(
        `UPDATE Places
        SET Name = '${name}',
        UserID = ${userId},
        Latitude = ${lat},
        Longitude = ${lon} 
        WHERE ID = ${id}`,
        onError,
        onSuccess,
        true
    );
};

const getAllUsers = (onError, onSuccess) => {
    sendQuery(`SELECT * FROM users`, onError, onSuccess);
};

const getUser = (id, onError, onSuccess) => {
    sendQuery(`SELECT * FROM users WHERE ID=${id}`, onError, onSuccess);
};

const addUser = ({ name, password }, onError, onSuccess) => {
    sendQuery(
        `INSERT INTO users (Name, Password) VALUES ('${name}','${password}')`,
        onError,
        onSuccess,
        true
    );
};

module.exports = {
    getPlace,
    getAllPlaces,
    addPlace,
    deletePlace,
    getPlacesOfUser,
    updatePlace,
    getAllUsers,
    getUser,
    addUser
};
