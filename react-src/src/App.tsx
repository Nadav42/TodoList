import React from 'react';
import { observer } from 'mobx-react'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TodoStoreProps } from './stores/todoStore'
import NotesList from './components/notes/NotesList'

import './css/main.css';

@observer
class App extends React.Component<TodoStoreProps> {
    componentDidMount() {
        this.props.todoStore.fetchNotes(); // load notes on startup
    }

    render() {
        return (
            <div className="container my-5">
                <NotesList todoStore={this.props.todoStore} />
                <ToastContainer />
            </div>
        )
    }
}

export default App;