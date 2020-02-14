import React from 'react';
import { observer } from 'mobx-react'

import { TodoStoreProps } from '../../stores/todoStore'

const NoteCreateButton = observer((props: TodoStoreProps) => {
    return (
        <div className="col-12 col-md-6 col-lg-3">
            <button className="btn btn-warning btn-orange w-100" onClick={props.todoStore.addNote}>New List</button>
        </div>
    );
});

export default NoteCreateButton;