import React from 'react';
import './css/main.css';

function Note() {
    return (
        <div className="col-12 col-md-6 col-lg-3">
            <div className="box mx-auto"></div>
        </div>
    );
}

function Note2() {
    return (
        <div className="col-12 col-md-6 col-lg-3">
            <div className="box2 mx-auto"></div>
        </div>
    );
}

const App = () => {
    return (
        <div className="container my-5">
            <div className="row">
                <Note />
                <Note2 />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
                <Note />
            </div>
        </div>

    );
}

export default App;
