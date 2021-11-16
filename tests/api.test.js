const request = require("supertest");
const app = require("../index");

describe("Test the path api/places", () => {
    test("Response to the GET", async () => {
        const res = await request(app)
            .get("/api/places")
            .expect(200); // http message 200 => the request succeeded
    });
});