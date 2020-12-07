import React, { Component } from 'react';

import NavbarHome from '../nav/NavbarHome.jsx'
import Cart from './Cart.jsx'


class CartPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
      
        }

    }

    componentDidMount() {
        
      }
    
    
    

    render() {                                                       
        return (
          <div id='products'>
            <NavbarHome />
            <Cart />
          </div>
        )
    }
}

export default CartPage