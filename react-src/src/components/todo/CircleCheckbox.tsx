import React from 'react';
import { MdCheck } from 'react-icons/md'

function CircleCheckbox(props: { checked: boolean, onChange: CallableFunction }) {


    if (props.checked) {
        return (
            <div className="circle-checkbox checked" onClick={() => { props.onChange() }}>
                <div className="checkmark"><MdCheck /></div>
            </div>
        );
    }
    else {
        return <div className="circle-checkbox" onClick={() => { props.onChange() }} />;
    }


}

export default CircleCheckbox;