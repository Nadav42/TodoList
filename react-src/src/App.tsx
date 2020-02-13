import React from 'react';
import { observer } from 'mobx-react'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TodoStoreProps } from './stores/todoStore'
import NoteDisplay from './components/notes/NoteDisplay'

@observer
class App extends React.Component<TodoStoreProps> {
    renderNotes() {
        return this.props.todoStore.notes.map(note => <NoteDisplay key={note.id} note={note} />)
    }

    render() {
        return (
            <div className="container my-2 mx-auto">
                {this.renderNotes()}
                <ToastContainer />
            </div>
        )
    }
}

export default App;