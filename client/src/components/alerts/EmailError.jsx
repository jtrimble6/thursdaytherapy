import React, { Component } from 'react';
import { Alert } from 'reactstrap'

//import { Link } from 'react-router-dom';

class EmailError extends Component {
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
        // console.log(this.props.EmailError);
        if (this.props.emailError === true) {
            return (
                <Alert color='danger' isOpen={this.state.visible}>
                    Please enter a valid email address!
                </Alert>
            )
        } else {
            return <div></div>
        }
    }
}

export default EmailError;