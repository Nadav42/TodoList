import { observable, computed, action, runInAction } from 'mobx';
import { getNotesData, getNoteById, postCreateNote, deleteNote, patchModifyItem, postCreateTodoItem, deleteTodoItem } from '../api/todoApi';
import { INote, ITodoItem } from '../api/interfaces'; // endpoint return type structures

// single todo item
class TodoItem {
    noteId: string; // parent note id
    @observable id: string;
    @observable name: string;
    @observable checked: boolean;
    removeTodoById: CallableFunction;

    constructor(noteId: string, itemData: ITodoItem, removeTodoById: CallableFunction) {
        this.noteId = noteId;
        this.id = itemData._id
        this.name = itemData.name;
        this.checked = itemData.checked;

        // function for removing todo items by id
        this.removeTodoById = removeTodoById;
    }

    @action
    toggleChecked = () => {
        patchModifyItem(this.noteId, this.id, this.name, !this.checked, (data: ITodoItem) => {
            this.checked = data.checked;
        });
    }

    @action // remove self
    remove = async () => {
        this.removeTodoById(this.id);
    }
}

// single note
class Note {
    @observable id: string;
    @observable name: string;
    @observable items: TodoItem[] = [];
    removeNoteById: CallableFunction;

    constructor(noteData: INote, removeNoteById: CallableFunction) {
        this.id = noteData._id
        this.name = noteData.name;

        // create instance with observable each todo item
        this.updateTodoItems(noteData);

        // function for removing note by id
        this.removeNoteById = removeNoteById;
    }

    @action
    fetchNoteData = async () => {
        const noteData = await getNoteById(this.id);
        runInAction(() => {
            this.name = noteData.name;
            this.items = []

            // create instance with observable each todo item
            this.updateTodoItems(noteData);
        })
    }

    @action
    updateTodoItems(note: INote) {
        this.items = [];

        note.items.forEach(item => {
            this.items.push(new TodoItem(this.id, item, this.removeTodoItemById))
        });
    }

    @action
    addItem = (name: string) => {
        // block empty string
        if (!name || name.trim().length == 0) {
            return
        }

        postCreateTodoItem(this.id, name, (itemData: ITodoItem) => {
            if (!itemData || !itemData._id) {
                return;
            }

            // create was done successfully
            this.items.push(new TodoItem(this.id, itemData, this.removeTodoItemById));
        });
    }

    @action // remove self
    remove = async () => {
        this.removeNoteById(this.id);
    }

    @action // remove child
    removeTodoItemById = async (itemId: string) => {
        const noteData: INote = await deleteTodoItem(this.id, itemId);

        // if note to delete was found and delete success
        if (noteData._id && noteData.items) {
            runInAction(() => {
                this.updateTodoItems(noteData);
            });
        }
    }
}

// list of all notes
class TodoStore {
    @observable notes: Note[] = [];
    @observable num = 1;

    @computed get mult() {
        return this.num * 2;
    }

    constructor() {
        this.fetchNotes();
    }

    @action
    fetchNotes = async () => {
        const notesData = await getNotesData();

        runInAction(() => {
            if (notesData) {
                this.notes = [];
            }

            notesData.results.forEach(note => {
                this.updateNoteData(note);
            })
        })
    }

    @action
    addNote = () => {
        postCreateNote("New List", (noteData: INote) => {
            if (!noteData || !noteData._id) {
                return;
            }

            // create was done successfully
            this.updateNoteData(noteData);
        });
    }

    @action
    updateNoteData(noteDetails: INote) {
        this.notes.push(new Note(noteDetails, this.removeNoteById));
    }

    @action
    removeNoteById = async (id: string) => {
        const data = await deleteNote(id);

        // if note to delete was found and delete success
        if (data._id && data._id == id) {
            runInAction(() => {
                this.fetchNotes();
            });
        }
    }
}

export interface TodoStoreProps {
    todoStore: TodoStore;
}

export interface NoteProps {
    note: Note;
}

export interface TodoItemProps {
    item: TodoItem;
}

const todoStore = new TodoStore();

export default todoStore;