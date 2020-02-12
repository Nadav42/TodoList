import { Router } from 'express';
import notes from './routes/notes';
import items from './routes/items'

export default () => {
	const app = Router();

	// add routes
	notes(app);
	items(app);

	return app
}