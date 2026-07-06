// Import Supertest.
// It lets us send HTTP requests to our Express app.
const request = require("supertest");

// Import the Express app.
// IMPORTANT: We import app.js, NOT server.js.
// app.js only creates the app.
// server.js starts listening on a port.
const app = require("../app");

// A single test case.
// The description will appear in the terminal.
test("GET /health should return 200 and status OK", async () => {

  // Send a GET request to /health.
  // This is similar to using Postman or curl.
  const response = await request(app)
    .get("/health");

  // Check that the HTTP status code is 200.
  expect(response.statusCode).toBe(200);

  // Check the JSON response.
  expect(response.body.status).toBe("OK");

  // Check another property.
  expect(response.body.message).toBe("Server is running");
});