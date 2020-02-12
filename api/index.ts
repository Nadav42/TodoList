import { Router } from 'express';
import notes from './routes/notes';

export default () => {
	const app = Router();
	notes(app);

	return app
}

// TODO:
// api/notes/fetch --> get all
// api/notes/create --> create a new note
// api/notes/modify --> change note name
// api/notes/remove --> delete note