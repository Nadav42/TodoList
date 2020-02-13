import React from 'react';
import { observer } from 'mobx-react'

import TodoItemDisplay from '../todo/TodoItemDisplay'

import { NoteProps } from '../../stores/todoStore'

@observer
class NoteDisplay extends React.Component<NoteProps, { editable: boolean, editableName: string, newItemValue: string }> {
    state = { editable: false, editableName: "", newItemValue: "" };

    handleEditToggle = () => {
        let editableName = this.state.editableName;

        // copy original name to edit input
        if (editableName.trim().length < 1) {
            editableName = this.props.note.name;
        }

        this.setState({ editable: !this.state.editable, editableName: editableName });
    }

    handleNewItemValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newItemValue: e.target.value });
    }

    handleEditableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ editableName: e.target.value });
    }

    handleChangeName = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.setState({ editable: false });
        this.props.note.changeName(this.state.editableName);
    }

    handleCreateNewItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.props.note.addItem(this.state.newItemValue);
        this.setState({ newItemValue: "" }); // reset form
    }

    renderTitle() {
        if (!this.state.editable) {
            return <h3 className="d-inline">{this.props.note.name}</h3>
        }

        // editable input
        return (
            <form onSubmit={this.handleChangeName}>
                <input type="text" value={this.state.editableName} onChange={this.handleEditableNameChange} />
            </form>
        );
    }

    render() {
        const note = this.props.note;
        const todos = this.props.note.items.map(item => <TodoItemDisplay key={item.id} item={item} />)

        return (
            <div className="mb-4">
                <div>
                    {this.renderTitle()}
                    <span className="text-muted" onClick={note.remove}>(remove)</span>
                    <span className="text-muted" onClick={this.handleEditToggle}>(edit)</span>
                </div>
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