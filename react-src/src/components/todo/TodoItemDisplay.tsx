import React from 'react';
import { observer } from 'mobx-react'

import { TodoItemProps } from '../../stores/todoStore'
import CircleCheckbox from './CircleCheckbox'

import { IoIosRemoveCircleOutline } from 'react-icons/io'

const TodoItemDisplay = observer((props: TodoItemProps) => {
    const item = props.item;
    let checkedClass = "";

    if (item.checked) {
        checkedClass = "checked";
    }

    return (
        <div className="todo-item">
            <div className="checkbox-container">
                <CircleCheckbox checked={item.checked} onChange={item.toggleChecked} />
            </div>

            <div className={`todo-content ${checkedClass}`}>{item.name}</div>
            <div className="todo-remove" onClick={item.remove}><IoIosRemoveCircleOutline /></div>
        </div>
    );
});

export default TodoItemDisplay;