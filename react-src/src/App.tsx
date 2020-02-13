import React from 'react';
import { observer } from 'mobx-react'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import todoStore, { TodoStoreProps } from './stores/todoStore'
import NoteDisplay from './components/notes/NoteDisplay'
import NoteCreateButton from './components/notes/NoteCreateButton'

@observer
class App extends React.Component<TodoStoreProps> {
    renderNotes() {
        return this.props.todoStore.notes.map(note => <NoteDisplay key={note.id} note={note} />)
    }

    render() {
        return (
            <div className="container my-2 mx-auto">
                {this.renderNotes()}
                <NoteCreateButton todoStore={this.props.todoStore} />
                <ToastContainer />
            </div>
        )
    }
}

export default App;