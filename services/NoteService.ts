import NotesModel from '../models/note';

class NotesService {
    // create a new note
    async createNote(name: String) {
        const note = await NotesModel.create({ name: name, items: [] });
        return note;
    }

    // find all notes
    async getAll() {
        const notes = await NotesModel.find(); // find all - maximum of 10 so no need for pagination
        return notes;
    }

    // update note details 
    async modifyNote(id: String, name: string) {
        let note = null;

        try {
            note = await NotesModel.findById(id);
        } catch (error) {
            return { errorMsg: "invalid id" };
        }

        if (!note) {
            return { errorMsg: "note not found" };
        }

        note.name = name; // change details
        return await note.save();
    }

    // remove note
    async removeNote(id: String) {
        let removed = null;

        try {
            removed = await NotesModel.findByIdAndRemove(id);
        } catch (error) {
            return { errorMsg: "invalid id" };
        }

        if (!removed) {
            return { errorMsg: "note does not exist" };
        }

        return removed
    }
}

export default NotesService;
