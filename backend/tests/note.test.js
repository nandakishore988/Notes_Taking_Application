const request = require("supertest");
const mongoose = require("mongoose");
const { app, Note } = require("../server"); // Import your Express app and Note model
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Set up in-memory MongoDB server
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory MongoDB server only if not connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }
});

// Clean up database between tests
afterEach(async () => {
  await Note.deleteMany({});
});

// Close the MongoDB connection and stop the in-memory server after all tests are complete
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop(); // Stop the MongoMemoryServer instance
});

describe("Note API Endpoints", () => {
  it("POST /notes - should create a new note", async () => {
    const newNote = { title: "Test Note", content: "This is a test note." };

    const response = await request(app)
      .post("/notes")
      .send(newNote);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe(newNote.title);
  });

  it("GET /notes - should return all notes", async () => {
    // Seed the database with a note
    await Note.create({ title: "Sample Note", content: "Sample Content" });

    const response = await request(app).get("/notes");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Sample Note");
  });

  it("DELETE /notes/:id - should delete a note by id", async () => {
    const note = await Note.create({ title: "Delete Me", content: "To be deleted." });

    const response = await request(app).delete(`/notes/${note._id}`);

    expect(response.status).toBe(204);

    // Check that the note no longer exists
    const deletedNote = await Note.findById(note._id);
    expect(deletedNote).toBeNull();
  });
});
