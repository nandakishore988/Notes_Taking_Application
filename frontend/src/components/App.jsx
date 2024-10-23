import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios"; // For API calls

function App() {
  const [notes, setNotes] = useState([]);

  // Fetch notes from backend on mount
  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await axios.get("http://localhost:5000/notes");
        setNotes(response.data); // Assuming the response contains an array of notes
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
    fetchNotes();
  }, []);

  // Add a new note to the backend
  async function addNote(newNote) {
    try {
      const response = await axios.post("http://127.0.0.1:5000/notes", newNote);
      setNotes(prevNotes => [...prevNotes, response.data]); // Append the saved note
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  // Delete a note from the backend and frontend
  async function deleteNote(id) {
    try {
      await axios.delete(`http://127.0.0.1:5000/notes/${id}`);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== id)); // Remove note from state
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem) => (
        <Note
          key={noteItem._id}
          id={noteItem._id}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={() => deleteNote(noteItem._id)}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;



// import React, { useState, useEffect } from "react";
// import Header from "./Header";
// import Footer from "./Footer";
// import Note from "./Note";
// import CreateArea from "./CreateArea";
// import axios from "axios"; // For API calls


// function App() {
//   const [notes, setNotes] = useState([]);

//   function addNote(newNote) {
//     setNotes(prevNotes => {
//       return [...prevNotes, newNote];
//     });
//   }

//   function deleteNote(id) {
//     setNotes(prevNotes => {
//       return prevNotes.filter((noteItem, index) => {
//         return index !== id;
//       });
//     });
//   }

//   return (
//     <div>
//       <Header />
//       <CreateArea onAdd={addNote} />
//       {notes.map((noteItem, index) => {
//         return (
//           <Note
//             key={index}
//             id={index}
//             title={noteItem.title}
//             content={noteItem.content}
//             onDelete={deleteNote}
//           />
//         );
//       })}
//       <Footer />
//     </div>
//   );
// }

// export default App;
