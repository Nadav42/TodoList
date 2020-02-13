import { observable, computed, action, runInAction } from 'mobx'
import { getNotesData, postCreateNote, patchModifyItem } from '../api/todoApi'
import { INote, ITodoItem } from '../api/interfaces'

// single todo item
class TodoItem {
    noteId: string; // parent note id
    @observable id: string;
    @observable name: string;
    @observable checked: boolean;

    constructor(noteId: string, itemData: ITodoItem) {
        this.noteId = noteId;
        this.id = itemData._id
        this.name = itemData.name;
        this.checked = itemData.checked;
    }

    @action
    toggleChecked = () => {
        patchModifyItem(this.noteId, this.id, this.name, !this.checked, (data: ITodoItem) => {
            console.log("patchModifyItem data", data)
            this.checked = data.checked;
        });
    }
}

// single note
class Note {
    @observable id: string;
    @observable name: string;
    @observable items: TodoItem[] = [];

    constructor(noteData: INote) {
        this.id = noteData._id
        this.name = noteData.name;

        noteData.items.forEach(item => {
            this.updateTodoItem(item);
        });
    }

    updateTodoItem(item: ITodoItem) {
        console.log("updateTodoItem", item);
        this.items.push(new TodoItem(this.id, item))
    }
}

// list of all notes
class TodoStore {
    @observable notes: Note[] = [];
    @observable num = 1;

    @computed get mult() {
        return this.num * 2;
    }

    @action increaseNum = () => {
        this.num = this.num + 1;
    }

    @action
    fetchNotes = async () => {
        const notesData = await getNotesData();

        runInAction(() => {
            notesData.results.forEach(note => {
                this.updateNoteData(note);
            })
        })
    }

    @action
    addNote = () => {
        postCreateNote("react-test-note", () => { });
    }

    @action
    updateNoteData(note: INote) {
        console.log("updateNoteData", note);
        this.notes.push(new Note(note));
    }

    constructor() {
        this.fetchNotes();
        this.addNote();
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