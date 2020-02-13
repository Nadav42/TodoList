import React from 'react'

interface propTypes {
    value: string,
    onChange: CallableFunction
    onBlur: CallableFunction
}

// an input field that is auto focused on mount
class FocusedInput extends React.Component<propTypes> {
    textInput: HTMLInputElement | null;

    constructor(props: propTypes) {
        super(props);

        this.textInput = null;
    }

    componentDidMount() {
        if (this.textInput) {
            this.textInput.focus();
            this.textInput.select();
        }
    }

    render() {
        return <input type="text" className="title-text-input" value={this.props.value} onChange={(e) => this.props.onChange(e)} onBlur={() => this.props.onBlur()} ref={elem => (this.textInput = elem)} />
    }
}

export default FocusedInput