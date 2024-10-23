const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;
console.log(process.env.PORT)
// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// MongoDB connection
mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.2mujj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// Define a Note model
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model('Note', noteSchema);

// API routes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/notes', async (req, res) => {
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
  });
  
  try {
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    console.log("Received DELETE request for note with id:", id); // Debugging line
    try {
      const deletedNote = await Note.findByIdAndDelete(id);
      if (!deletedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
      console.error("Error while deleting:", err.message); // Debugging line
      res.status(500).json({ message: err.message });
    }
  });
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
