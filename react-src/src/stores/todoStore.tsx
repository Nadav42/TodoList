import { observable, computed, action, runInAction } from 'mobx';
import { getNotesData, getNoteById, postCreateNote, patchModifyNote, deleteNote, patchModifyItem, postCreateTodoItem, deleteTodoItem } from '../api/todoApi';
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
    @observable createdAt: Date;
    @observable updatedAt: Date;
    @observable private itemsJsonArray: ITodoItem[] = []; // array of json objects, use computed property "items" for actions
    removeNoteById: CallableFunction;

    // create instances with observable for each todo item
    @computed get items(): TodoItem[] {
        return this.itemsJsonArray.map(item => new TodoItem(this.id, item, this.removeTodoItemById));
    }

    constructor(noteData: INote, removeNoteById: CallableFunction) {
        this.id = noteData._id
        this.name = noteData.name;
        this.createdAt = noteData.createdAt;
        this.updatedAt = noteData.updatedAt;

        // create instance with observable each todo item
        this.itemsJsonArray = noteData.items;

        // function for removing note by id
        this.removeNoteById = removeNoteById;
    }

    @action
    fetchNoteData = async () => {
        const noteData = await getNoteById(this.id);

        if (noteData._id) {
            runInAction(() => {
                this.name = noteData.name;
                this.itemsJsonArray = noteData.items;
            })
        }
    }

    @action
    addItem = (name: string) => {
        // return if empty string
        if (!name || name.trim().length === 0) {
            return
        }

        // create new todo item in this note
        postCreateTodoItem(this.id, name, (itemData: ITodoItem) => {
            if (!itemData || !itemData._id) {
                return;
            }

            // create was done successfully - instant
            this.itemsJsonArray.push(itemData);

            // sync
            this.fetchNoteData();
        });
    }

    @action
    changeName = (newName: string) => {
        patchModifyNote(this.id, newName, (data: INote) => {
            this.name = data.name;
        });
    }

    @action // remove self
    remove = async () => {
        this.removeNoteById(this.id);
    }

    @action // remove child (todo item)
    removeTodoItemById = async (itemId: string) => {
        const noteData: INote = await deleteTodoItem(this.id, itemId);

        // if note to delete was found and delete success
        if (noteData._id && noteData.items) {
            runInAction(() => {
                this.itemsJsonArray = noteData.items;
            });
        }
        else {
            this.fetchNoteData();
        }
    }
}

// list of all notes
class TodoStore {
    @observable notesJsonArray: INote[] = [];

    // create instances with observable for each todo item
    @computed get notes(): Note[] {
        return this.notesJsonArray.map(note => new Note(note, this.removeNoteById));
    }

    @action
    fetchNotes = async () => {
        const notesData = await getNotesData();

        if (!notesData) {
            return // most likely server is down
        }

        runInAction(() => {
            this.notesJsonArray = notesData.results;
        })
    }

    @action
    addNote = () => {
        postCreateNote("רשימה חדשה", (noteData: INote) => {
            if (!noteData || !noteData._id) {
                return;
            }

            // create was done successfully
            this.notesJsonArray.push(noteData);

            // sync
            this.fetchNotes();
        });
    }

    @action
    removeNoteById = async (id: string) => {
        const data = await deleteNote(id);

        // if note to delete was found and delete success
        if (data._id && data._id === id) {
            runInAction(() => {
                this.fetchNotes();
            });
        }
    }
}

// interfaces for react prop types
export interface TodoStoreProps {
    todoStore: TodoStore;
}

export interface NoteProps {
    note: Note;
}

export interface TodoItemProps {
    item: TodoItem;
}

// the store
const todoStore = new TodoStore();

export default todoStore;