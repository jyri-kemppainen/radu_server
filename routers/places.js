const db = require("../db.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = require("express").Router();

const handleError = (err, response) => {
   response.status(404).json(err);
};

const prcessToken = (request) => {
    const auth = request.get("authorization");
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const token = auth.substring(7);
        const decodedToken = jwt.verify(token, process.env.SECRET);
        
        if (!token || !decodedToken.id) {
            return false;
        }
        return decodedToken.id;
    } else {
        return false;
    }
};

router.get("/", (request, response) => {
    db.getAllPlaces(
        (err) => {
            handleError(err, response);
        },
        (places) => {
            response.json(places);
        }
    );
});

// not used in web app
router.get("/:id", (request, response) => {
    const id = request.params.id;
    db.getPlace(
        id,
        (err) => {
            handleError(err, response);
        },
        (place) => {
            if (place.length == 0) {
                response.status(404);
                response.json({ error: "no place with id " + id });
            } else {
                response.json(place);
            }
        }
    );
});

router.post("/", (request, response) => {
    const decodedUserId = prcessToken(request);
    if (decodedUserId != request.body.userId) {
        handleError({ err: "Not Authorized" }, response);
        return;
    }

    db.addPlace(
        request.body,
        (err) => {
            handleError(err, response);
        },
        (status) => {
            db.getPlace(
                status.insertId,
                (err) => {
                    handleError(err, response);
                },
                (place) => {
                    if (place.length == 0) {
                        response.status(404);
                        response.json({ error: "no place with id " + id });
                    } else {
                        response.json(place);
                    }
                }
            );
        }
    );
});

router.delete("/:id", (request, response) => {
    const id = request.params.id;
    db.getPlace(
        id,
        (err) => {
            handleError(err, response);
        },
        (resultArr) => {
            if (resultArr.length == 0) {
                response.status(404);
                response.json({ error: "no place with id " + id });
                return;
            } else {
                const decodedUserId = prcessToken(request);
                if (decodedUserId != resultArr[0].UserID) {
                    handleError({ err: "Not Authorized" }, response);
                    return;
                }
                // Callback hell (can be avoided with mariadb Promise API)
                db.deletePlace(
                    id,
                    (err) => {
                        handleError(err, response);
                    },
                    (status) => {
                        response.json(status);
                    }
                );
            }
        }
    );
});

router.put("/:id", (request, response) => {
    const id = request.params.id;
    db.getPlace(
        id,
        (err) => {
            handleError(err, response);
        },
        (resultArr) => {
            if (resultArr.length == 0) {
                response.status(404);
                response.json({ error: "no place with id " + id });
                return;
            } else {
                const decodedUserId = prcessToken(request);
                if (decodedUserId != resultArr[0].UserID) {
                    handleError({ err: "Not Authorized" }, response);
                    return;
                }
                // Callback hell (can be avoided with mariadb Promise API)
                db.updatePlace(
                    id,
                    request.body,
                    (err) => {
                        handleError(err, response);
                    },
                    (status) => {
                        db.getPlace(
                            id,
                            (err) => {
                                handleError(err, response);
                            },
                            (place) => {
                                response.json(place);
                            }
                        );
                    }
                );
            }
        }
    );
});

// not used in web app
router.get("/nearby/:lat/:lon/:dist", (request, response) => {
    const lat = request.params.lat;
    const lon = request.params.lon;
    const dist = request.params.dist; // distance in km

    db.getAllPlaces(
        (err) => {
            handleError(err, response);
        },
        (places) => {
            response.json(getPlacesNearby(places, lat, lon, dist));
        }
    );
});

// not used in web app
// Modified this function from Pia Heinonen
function getPlacesNearby(allPlaces, lat, lon, dist) {
    const lat1 = (lat * Math.PI) / 180;
    const R = 6371;

    // adding distance attribute to each place (GCD)
    var placesWithDistances = allPlaces.map((place) => {
        var lat2 = (place.Latitude * Math.PI) / 180;
        var lonDiff = ((place.Longitude - lon) * Math.PI) / 180;
        var d =
            Math.acos(
                Math.sin(lat1) * Math.sin(lat2) +
                    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lonDiff)
            ) * R;
        place.Distance = d;
        return place;
    });

    //filtering based on dist
    return placesWithDistances.filter((item) => item.Distance <= dist);
}

module.exports = router;
