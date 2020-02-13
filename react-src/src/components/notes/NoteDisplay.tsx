import React from 'react';
import { observer } from 'mobx-react'

import TodoItemDisplay from '../todo/TodoItemDisplay'

import { NoteProps } from '../../stores/todoStore'

@observer
class NoteDisplay extends React.Component<NoteProps> {
    state = { newItemValue: "" };

    handleNewItemValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newItemValue: e.target.value });
    }

    handleCreateNewItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        this.props.note.addItem(this.state.newItemValue);
        this.setState({ newItemValue: "" }); // reset form
    }

    render() {
        const note = this.props.note;
        const todos = this.props.note.items.map(item => <TodoItemDisplay key={item.id} item={item} />)

        return (
            <div className="mb-4">
                <div><h3 className="d-inline">{note.name}</h3> <span className="text-muted" onClick={note.remove}>(remove)</span></div>
                <ul>
                    {todos}
                </ul>
                <div>
                    <form onSubmit={this.handleCreateNewItem}>
                        <input type="text" value={this.state.newItemValue} onChange={this.handleNewItemValueChange} />
                        <button type="submit">Add</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default NoteDisplay;