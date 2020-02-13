import React from 'react';
import { TodoItemProps } from '../../stores/todoStore'

function TodoItemDisplay(props: TodoItemProps) {
    const item = props.item;

    return (
        <li><input type="checkbox" checked={item.checked} onChange={item.toggleChecked}/>{item.name}</li>
    );
}

export default TodoItemDisplay;