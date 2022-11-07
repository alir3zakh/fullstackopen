import axios from 'axios'
import { useState, useEffect } from 'react'
import Note from './components/Note'

const App = () => {
  //component states
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log(response)
        setNotes(response.data)
      })
  }, []);
  console.log('render', notes.length, 'notes');


  // event handlers
  const addNote = (event) => {
    event.preventDefault();

    const noteObject = {
      id: notes.length + 1,
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    }

    setNotes(notes.concat(noteObject))
    setNewNote('')
  }

  const changeNoteHandle = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  // other vars / functions
  const notesToShow = (showAll ? notes :
    notes.filter(note => note.important))

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {notesToShow.map(note =>
          <Note key={note.id}
            note={note}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={changeNoteHandle}
        />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App
