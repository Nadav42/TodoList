import NotesModel from '../models/note';
import ItemModel from '../models/item';
import { IModifyItemForm } from '../interfaces/INoteItem'

const ERROR_NOTE_DOES_NOT_EXIST = { errorMsg: "note does not exist" };
const ERROR_ITEM_DOES_NOT_EXIST = { errorMsg: "item does not exist" };
const ERROR_ADD_NOTE = { errorMsg: "can't add item to that note" };
const ERROR_MODIFY_ITEM = { errorMsg: "can't add modify item in that note" };
const ERROR_INVALID_ITEM = { errorMsg: "invalid item" };

class ItemService {
    // add a new item to an existing note
    async addItem(noteId: string, itemName: string) {
        try {
            // find the note document
            let noteRecord = await NotesModel.findById(noteId);

            if (!noteRecord) {
                return ERROR_NOTE_DOES_NOT_EXIST;
            }

            // add the item to the items list (items are nested in notes)
            const item = new ItemModel({ name: itemName })
            noteRecord.items.push(item)

            // save changes to db and return the updated document
            await noteRecord.save();
            return item;
        } catch (error) {
            return ERROR_ADD_NOTE;
        }
    }

    // change item name
    async modifyItem(noteId: string, itemId: string, modifyForm: IModifyItemForm) {
        try {
            // find the note document
            let noteRecord = await NotesModel.findById(noteId);

            if (!noteRecord) {
                return ERROR_NOTE_DOES_NOT_EXIST;
            }

            // find item record inside items list (items are nested in notes)
            const itemToModify = noteRecord.items.find(itemRecord => itemRecord._id == itemId);

            if (!itemToModify) {
                return ERROR_ITEM_DOES_NOT_EXIST;
            }

            // change the item's details (patch so only change what was sent)
            if (modifyForm.name) {
                itemToModify.name = modifyForm.name;
            }

            if (modifyForm.checked !== undefined) {
                itemToModify.checked = modifyForm.checked;
            }

            // save note changes to db and return the updated document
            await noteRecord.save();
            return itemToModify;
        } catch (error) {
            return ERROR_MODIFY_ITEM;
        }
    }

    // remove item from a note
    async removeItem(noteId: string, itemId: string) {
        try {
            // find the note document
            let noteRecord = await NotesModel.findById(noteId);

            if (!noteRecord) {
                return ERROR_NOTE_DOES_NOT_EXIST;
            }

            // remove the item from the items list (items are nested in notes)
            const currentItemsCount = noteRecord.items.length
            const items = noteRecord.items.pull(({ _id: itemId }));

            if (!currentItemsCount || items.length === currentItemsCount) {
                return ERROR_ITEM_DOES_NOT_EXIST;
            }

            // save changes and return the updated document
            return await noteRecord.save();
        } catch (error) {
            return ERROR_INVALID_ITEM;
        }
    }
}

export default ItemService;
