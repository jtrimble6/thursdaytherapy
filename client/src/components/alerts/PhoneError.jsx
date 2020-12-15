import React, { Component } from 'react';
import { Alert } from 'reactstrap'

//import { Link } from 'react-router-dom';

class PhoneError extends Component {
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
        // console.log(this.props.passwordError);
        if (this.props.phoneError === true) {
            return (
                <Alert color='warning' isOpen={this.state.visible}>
                    Please enter a valid phone number!
                </Alert>
            )
        } else {
            return <div></div>
        }
    }
}

export default PhoneError;