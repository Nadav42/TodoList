import React from 'react';
import { observer } from 'mobx-react'
import { FaEdit, FaTrash } from 'react-icons/fa'

import TodoItemDisplay from '../todo/TodoItemDisplay'
import { NoteProps } from '../../stores/todoStore'
import FocusedInput from './FocusedInput'

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

    handleRemoveNote = () => {
        const confirmResult = window.confirm("This action can not be restored, delete note?");
        if (confirmResult) {
            this.props.note.remove();
        }
    }

    handleNewItemValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newItemValue: e.target.value });
    }

    handleEditableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ editableName: e.target.value });
    }

    // submit list name change
    handleChangeName = (e: React.FormEvent<HTMLFormElement>) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        this.setState({ editable: false });

        if (this.state.editableName && this.state.editableName.trim().length > 0) {
            this.props.note.changeName(this.state.editableName);
        }
    }

    // submit new todo item
    handleCreateNewItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.props.note.addItem(this.state.newItemValue);
        this.setState({ newItemValue: "" }); // reset form
    }

    // editable title
    renderTitle() {
        if (!this.state.editable) {
            return <div className="note-title" onClick={this.handleEditToggle}>{this.props.note.name}</div>;
        }

        // editable input
        return (
            <form onSubmit={this.handleChangeName}>
                <FocusedInput value={this.state.editableName} onChange={this.handleEditableNameChange} onBlur={this.handleChangeName} />
            </form>
        );
    }

    render() {
        const todos = this.props.note.items.map(item => <TodoItemDisplay key={item.id} item={item} />)

        return (
            <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="todo-list-container mx-auto border">
                    <div className="row">
                        <div className="col-8">
                            {this.renderTitle()}
                        </div>
                        <div className="col-4 text-right">
                            <span className="title-icon text-muted" onClick={this.handleEditToggle}><FaEdit /></span>
                            <span className="title-icon text-muted" onClick={this.handleRemoveNote}><FaTrash /></span>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="todo-list">
                        {todos}
                    </div>
                    <div>
                        <form onSubmit={this.handleCreateNewItem}>
                            <div className="input-group">
                                <input type="text" className="item-text-input" value={this.state.newItemValue} onChange={this.handleNewItemValueChange} placeholder="Add task" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default NoteDisplay;