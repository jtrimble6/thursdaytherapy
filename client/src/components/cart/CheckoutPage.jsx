import React, { Component } from 'react';

import NavbarHome from '../nav/NavbarHome.jsx'
import Checkout from './Checkout.jsx'


class CheckoutPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
      
        }

    }

    componentDidMount() {
        
      }
    
    
    

    render() {                                                       
        return (
          <div id='cartPage'>
            <NavbarHome />
            <Checkout />
          </div>
        )
    }
}

export default CheckoutPage