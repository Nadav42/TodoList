import React from 'react';

function CircleCheckbox(props: { checked: boolean, onChange: CallableFunction }) {
    let checkedClass = "";

    if (props.checked) {
        checkedClass = "checked";
    }

    return (
        <div className={`circle-checkbox ${checkedClass}`} onClick={() => { props.onChange() }} />
    );
}

export default CircleCheckbox;