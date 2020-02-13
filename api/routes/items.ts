
import { Router } from 'express'
import ItemService from '../../services/ItemService'
import { IModifyItemForm } from '../../interfaces/INoteItem'

const itemService = new ItemService();

export default (app: Router) => {
	// create new note
	app.post('/items/add', async (req, res) => {
		const body = req.body;

		const noteId = body.noteId;
		const itemName = body.itemName;

		// TODO: define body expected type and check that it has all properties 
		if (!noteId) {
			res.send({ errorMsg: "must provide note id" });
			return;
		}
		else if (!itemName) {
			res.send({ errorMsg: "must provide item name" });
			return;
		}

		const newItemData = await itemService.addItem(noteId, itemName);
		res.send(newItemData);
	})

	// modify item name
	app.patch('/items/:noteId/:itemId', async (req, res) => {
		const params = req.params;
		const body = req.body;

		const noteId = params.noteId;
		const itemId = params.itemId;
		const IModifyItemForm: IModifyItemForm = body;

		if (!noteId || !itemId) {
			res.send({ errorMsg: "must provide id of note and item to remove" });
			return;
		}

		const note = await itemService.modifyItem(noteId, itemId, IModifyItemForm);
		res.send(note);
	})

	// remove item from a note
	app.delete('/items/:noteId/:itemId', async (req, res) => {
		const params = req.params;

		const noteId = params.noteId;
		const itemId = params.itemId;

		if (!noteId || !itemId) {
			res.send({ errorMsg: "must provide an ids of note and item to remove" });
			return;
		}

		const updatedNote = await itemService.removeItem(noteId, itemId);
		res.send(updatedNote);
	})
}
