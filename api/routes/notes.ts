
import { Router } from 'express'
import NotesService from '../../services/NoteService'

const notesService = new NotesService();

export default (app: Router) => {
	// create new note
	app.post('/notes/create', async (req, res) => {
		const body = req.body;

		if (!body.name) {
			res.send({ errorMsg: "notes must have a name" });
			return;
		}

		const note = await notesService.createNote(body.name);
		res.send(note);
	})

	// get existing notes
	app.get('/notes/fetch', async (req, res) => {
		const data = await notesService.getAll();
		res.send({ results: data });
	})

	// update note details (name)
	app.patch('/notes/:noteId', async (req, res) => {
		const params = req.params;
		const body = req.body;

		if (!params.noteId) {
			res.send({ errorMsg: "must provide an id to modify note" });
			return;
		}
		else if (!body.name) {
			res.send({ errorMsg: "must provide a name for the change" });
			return;
		}

		const note = await notesService.modifyNote(params.noteId, body.name);
		res.send({ note });
	})

	// remove a note
	app.delete('/notes/:noteId', async (req, res) => {
		const params = req.params;

		if (!params.noteId) {
			res.send({ errorMsg: "must provide an id to remove note" });
			return;
		}

		const removedNote = await notesService.removeNote(params.noteId);
		res.send({ removedNote });
	})
}
