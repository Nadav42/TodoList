import React from 'react';
import { observer } from 'mobx-react'

import { TodoItemProps } from '../../stores/todoStore'

const TodoItemDisplay = observer((props: TodoItemProps) => {
    const item = props.item;

    return (
        <li><input type="checkbox" checked={item.checked} onChange={item.toggleChecked} />{item.name}</li>
    );
});

export default TodoItemDisplay;