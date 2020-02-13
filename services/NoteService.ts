import NotesModel from '../models/note';

const MAXIMUM_NOTES_ALLOWED = 10;

class NotesService {
    // create a new note - max 10 allowed at once
    async createNote(name: string) {
        const currentNotesAmount = await NotesModel.count({});

        if (currentNotesAmount >= MAXIMUM_NOTES_ALLOWED) {
            return {errorMsg: `Only ${MAXIMUM_NOTES_ALLOWED} notes are allowed at once, please remove some.`};
        }

        const note = await NotesModel.create({ name: name, items: [] });
        return note;
    }

    // find all notes
    async getAll() {
        const notes = await NotesModel.find().sort([['createdAt', 'ascending']]); // find all - maximum of 10 so no need for pagination
        return notes;
    }

    // find all notes
    async getById(noteId: string) {
        const note = await NotesModel.findById(noteId);
        return note;
    }

    // update note details 
    async modifyNote(id: string, name: string) {
        try {
            let noteRecord = await NotesModel.findById(id);

            if (!noteRecord) {
                return { errorMsg: "note not found" };
            }

            noteRecord.name = name; // change details
            return await noteRecord.save();

        } catch (error) {
            return { errorMsg: "invalid id" };
        }
    }

    // remove note
    async removeNote(id: string) {
        try {
            const removedNoteRecord = await NotesModel.findByIdAndRemove(id);

            if (!removedNoteRecord) {
                return { errorMsg: "note does not exist" };
            }

            return removedNoteRecord
        } catch (error) {
            return { errorMsg: "invalid id" };
        }
    }
}

export default NotesService;
