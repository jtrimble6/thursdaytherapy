import React, { Component } from 'react';
import { Alert } from 'reactstrap'

//import { Link } from 'react-router-dom';

class ChangeStepError extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true
        }

        this.onDismiss = this.onDismiss.bind(this)
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    render() {
        if (this.props.changeStepError === true) {
            return (
                <Alert className='changeStepAlert' color='danger' isOpen={this.state.visible}>
                    There are errors on the form!
                </Alert>
            )
        } else if (this.props.stepOneFieldError === true) {
            return (
                <Alert className='changeStepAlert' color='danger' isOpen={this.state.visible}>
                    Please fill out all required fields!
                </Alert>
            )
        } else {
            return <div></div>
        }
    }
}

export default ChangeStepError;