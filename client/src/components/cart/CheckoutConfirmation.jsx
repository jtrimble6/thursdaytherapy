import React, { Component } from 'react'
// import { Table } from 'rsuite';

// CSS
import '../../css/cart/cartCheckout.css'


class CheckoutConfirmation extends Component {

    componentDidMount() {
        // console.log('Personal Info Ready')
      }

    render() {
        // Verify this is current step
        if (this.props.currentStep !== 3) {
            return null
        }

        return (
            <div className='checkoutFormRow orderInfoStep'>
              <h2 className='orderInfoTitle'>Order Confirmation</h2>
              <p>A confirmation email has been sent to the email provided (It may be sent to your spam folder).</p>
              
                
            </div>
        )
    };
};

export default CheckoutConfirmation;
       