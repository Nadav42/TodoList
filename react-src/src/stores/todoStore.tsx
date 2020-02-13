import { observable, computed, action, runInAction } from 'mobx'
import { getSomeData, postCreateNote } from '../api/todoApi'

class TodoStore {
    @observable objData = {}
    @observable num = 1;

    @computed get mult() {
        return this.num * 2;
    }

    @action increaseNum = () => {
        this.num = this.num + 1;
    }

    @action
    fetchNotes = async () => {
        const data = await getSomeData();
        
        runInAction(() => {
            this.objData = data;
        })
    }

    @action
    addNote = () => {
        postCreateNote("react-test-note", () => {});
    }

    constructor() {
        this.fetchNotes();
        this.addNote();
    }
}

export interface TodoStoreProps {
    todoStore: TodoStore;
}

const todoStore = new TodoStore();

export default todoStore;