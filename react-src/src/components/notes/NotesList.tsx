import React from 'react';
import { observer } from 'mobx-react'

import { TodoStoreProps } from '../../stores/todoStore'
import NoteDisplay from './NoteDisplay'
import NoteCreateButton from './NoteCreateButton'

const NotesList = observer((props: TodoStoreProps) => {
    const noteElements = props.todoStore.notes.map(note => <NoteDisplay key={note.id} note={note} />)

    return (
        <div className="row">
            {noteElements}
            <NoteCreateButton todoStore={props.todoStore} />
        </div>
    )
});

export default NotesList;