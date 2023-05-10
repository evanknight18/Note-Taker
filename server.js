const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;
const util = require('util');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const readFromFile = util.promisify(fs.readFile);

// HTML routes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// API routes
app.get('/api/notes', (req, res) => {
  // const notes = JSON.parse(fs.readFileAsync('db/db.json', 'utf8'));
  // console.log(notes);
  // let parsedNotes = [].concat(notes);
  // console.log(parsedNotes);
  // res.json(parsedNotes);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = Date.now().toString();
  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
  notes.push(newNote);
  fs.writeFileSync('db/db.json', JSON.stringify(notes));
  res.json(newNote);
});

// DELETE route (bonus)
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  notes = notes.filter(note => note.id !== noteId);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
