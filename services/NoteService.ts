import NotesModel from '../models/note';

const MAXIMUM_NOTES_ALLOWED = 10;
const ERROR_NOTE_DOES_NOT_EXIST = { errorMsg: "note does not exist" };
const ERROR_INVALID_ID = { errorMsg: "invalid id" };

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class NotesService {
    // create a new note - max 10 allowed at once
    async createNote(name: string) {
        const currentNotesAmount = await NotesModel.count({}); // get current notes amount

        // user reached maximum notes allowed
        if (currentNotesAmount >= MAXIMUM_NOTES_ALLOWED) {
            return { errorMsg: `Only ${MAXIMUM_NOTES_ALLOWED} notes are allowed at once, please remove some.` };
        }

        // limit not reached - add new note
        return await NotesModel.create({ name: name, items: [] });
    }

    // find all notes
    async getAll() {
        await sleep(2000);
        return await NotesModel.find().sort([['createdAt', 'ascending']]); // find all - maximum of 10 so no need for pagination
    }

    // find all notes
    async getById(noteId: string) {
        await sleep(2000);
        return await NotesModel.findById(noteId);
    }

    // update note details 
    async modifyNote(id: string, name: string) {
        try {
            let noteRecord = await NotesModel.findById(id);

            if (!noteRecord) {
                return ERROR_NOTE_DOES_NOT_EXIST;
            }

            noteRecord.name = name; // change details
            return await noteRecord.save();

        } catch (error) {
            return ERROR_INVALID_ID;
        }
    }

    // remove note
    async removeNote(id: string) {
        try {
            const removedNoteRecord = await NotesModel.findByIdAndRemove(id);

            if (!removedNoteRecord) {
                return ERROR_NOTE_DOES_NOT_EXIST;
            }

            return removedNoteRecord
        } catch (error) {
            return ERROR_INVALID_ID;
        }
    }
}

export default NotesService;
