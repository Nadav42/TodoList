import NotesModel from '../models/note';
import ItemModel from '../models/item';
import { IModifyItemForm } from '../interfaces/INoteItem'

class ItemService {
    // add a new item to an existing note
    async addItem(noteId: string, itemName: string) {
        try {
            // find the note document
            let noteRecord = await NotesModel.findById(noteId);

            if (!noteRecord) {
                return {errorMsg: "note does not exist"}
            }
            
            // add the item to the items list (items are nested in notes)
            const item = new ItemModel({name: itemName})
            noteRecord.items.push(item)

            // save changes to db and return the updated document
            await noteRecord.save();
            return item;
        } catch (error) {
            return {errorMsg: "can't add item to that note"}
        }
    }

    // change item name
    async modifyItem(noteId: string, itemId: string, modifyForm: IModifyItemForm) {
        try {
            // find the note document
            let noteRecord = await NotesModel.findById(noteId);

            if (!noteRecord) {
                return {errorMsg: "note does not exist"}
            }
            
            // find item record inside items list (items are nested in notes)
            const itemToModify = noteRecord.items.find(itemRecord => itemRecord._id == itemId);

            if (!itemToModify) {
                return {errorMsg: "item does not exist"}
            }

            // change the item's details (patch so only change what was sent)
            if (modifyForm.name) {
                itemToModify.name = modifyForm.name;
            }

            if (modifyForm.checked) {
                itemToModify.checked = modifyForm.checked;
            }

            // save note changes to db and return the updated document
            return await noteRecord.save();
        } catch (error) {
            return {errorMsg: "can't add item to that note"}
        }
    }

    // remove item from a note
    async removeItem(noteId: string, itemId: string) {
        try {
            // find the note document
            let noteRecord = await NotesModel.findById(noteId);

            if (!noteRecord) {
                return {errorMsg: "note does not exist"}
            }
            
            // remove the item from the items list (items are nested in notes)
            noteRecord.items.pull(({ _id: itemId }));

            // save changes and return the updated document
            return await noteRecord.save();
        } catch (error) {
            return {errorMsg: "invalid item to remove"}
        }
    }
    
}

export default ItemService;
