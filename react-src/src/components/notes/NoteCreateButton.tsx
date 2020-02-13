import React from 'react';
import { observer } from 'mobx-react'

import TodoItemDisplay from '../todo/TodoItemDisplay'

import { TodoStoreProps } from '../../stores/todoStore'

const NoteCreateButton = observer((props: TodoStoreProps) => {
    return (
        <div>
            <button onClick={props.todoStore.addNote}>New Note</button>
        </div>
    );
});

export default NoteCreateButton;