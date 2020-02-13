import React from 'react';
import { observer } from 'mobx-react'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TodoStoreProps } from './stores/todoStore'

function Display(props: { value: number }) {
    return (
        <p className="text-primary">{props.value}</p>
    );
}

@observer
class App extends React.Component<TodoStoreProps> {
    render() {
        console.log(this.props);

        return (
            <div className="container my-2 mx-auto text-center">
                <Display value={this.props.todoStore.num} />
                <p>Current value: {this.props.todoStore.num}</p>
                <p>Calculated value: {this.props.todoStore.mult}</p>
                <button onClick={this.props.todoStore.increaseNum}>Increase number</button>

                <ToastContainer />
            </div>
        )
    }
}

export default App;