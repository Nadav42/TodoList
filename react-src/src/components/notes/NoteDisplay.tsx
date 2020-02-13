import React from 'react';
import { observer } from 'mobx-react'

import TodoItemDisplay from '../todo/TodoItemDisplay'

import { NoteProps } from '../../stores/todoStore'

const NoteDisplay = observer((props: NoteProps) => {
    const note = props.note;
    const todos = props.note.items.map(item => <TodoItemDisplay key={item.id} item={item} />)

    return (
        <div>
            <div><h3 className="d-inline">{note.name}</h3> <span className="text-muted" onClick={note.remove}>(remove)</span></div>
            <ul>
                {todos}
            </ul>
        </div>
    );
});

export default NoteDisplay;