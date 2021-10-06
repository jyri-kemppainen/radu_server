const db = require("../db.js");
const router = require("express").Router();

const handleError = (err, response) => {
    // this will need to support multiple status codes
    response.status(404).json(err);
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

router.get("/:id", (request, response) => {
    const id = request.params.id;
    db.getPlace(id,
        (err) => {
            handleError(err, response);
        },
        (place) => {
            if (place.length==0) {
                response.status(404);
                response.json({ error: "no place with id " + id });
            } else {
                response.json(place);
            }
        }
    );
});

router.post("/", (request, response) => {
    db.addPlace(
        request.body,
        (err) => {
            handleError(err, response);
        },
        (status) => {
            // this will be replaced
            // with your code from Assignment 1
            db.getAllPlaces(
                (err) => {
                    handleError(err, response);
                },
                (places) => {
                    const result = places.find((p) => p.ID == status.insertId);
                    if (!result) {
                        response.status(404);
                        response.json({
                            error: "no place with id " + status.insertId,
                        });
                    } else {
                        response.json(result);
                    }
                }
            );
        }
    );
});

router.delete("/:id", (request, response) => {
	const id = request.params.id;
	db.deletePlace(
        id,
		(err) => {
			handleError(err, response);
		},
		(status) => {
            response.json(status);
		}
	);
});


// Update place with given id, PUT /api/places/:id
//
router.put("/:id", (request, response) => {
    const id = request.params.id;
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
});

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

// Modified this function from Pia Heinonen
function getPlacesNearby(allPlaces, lat, lon, dist) {
    const lat1 = lat * Math.PI/180;
    const R = 6371; 

    // adding distance attribute to each place (GCD)
    var placesWithDistances = allPlaces.map(place => {
        var lat2 = place.Latitude * Math.PI/180;
        var lonDiff = (place.Longitude - lon) * Math.PI/180;
        var d = Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lonDiff))*R;
        place.Distance = d;
        return place;
    });

    //filtering based on dist
    return placesWithDistances.filter(item => item.Distance <= dist);
}

module.exports = router;
