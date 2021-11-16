const db = require("../db.js");

describe('Unit tests - test the database methods', () => {
    test('Test db.getAllPlaces function', () => {
        let places;
        db.getAllPlaces(
            (err) => handleError(err, response),
            (places) => {
                expect(typeof(places)).toBe("object");
            }
        ); 
    });

    it('Test db.getPlace function', () => {
        var id = 1;
        db.getPlace(
            id,
            (err) => handleError(err, response),
            (place) => {
                expect(place[0].Name).toBe("favorite beach");
                expect(place[0].UserID).toBe(1);
                expect(place[0].UserName).toBe("Radu");
            }
        ); 
    });

});
