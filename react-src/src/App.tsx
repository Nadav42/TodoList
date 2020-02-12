import React from 'react';
import './css/main.css';

function Note() {
    return (
        <div className="col-12 col-md-4">
            <div className="box"></div>
        </div>
    );
}

const App = () => {
    return (
        <div className="container mt-5 border">
            <div className="row">
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
            </div>
        </div >

    );
}

export default App;
