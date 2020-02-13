import React from 'react';
import TodoItemDisplay from '../todo/TodoItemDisplay'

import { NoteProps } from '../../stores/todoStore'

function NoteDisplay(props: NoteProps) {
    const note = props.note;
    const todos = props.note.items.map(item => <TodoItemDisplay key={item.id} item={item} />)

    return (
        <div>
            <h3>{note.name}</h3>
            <ul>
                {todos}
            </ul>
        </div>
    );
}

export default NoteDisplay;