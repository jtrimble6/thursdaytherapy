import React, { Component } from 'react';

import NavbarHome from '../nav/NavbarHome.jsx'
import Cart from './Cart.jsx'


class CartPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
          cartCount: ''
        }

        this.getCart = this.getCart.bind(this)
    }

    componentDidMount() {
        // this.getCart()
      }
    
    getCart = () => {
        let cartCount = localStorage.length
        // console.log('CART COUNT: ', cartCount)
        this.setState({
            cartCount: cartCount
        })
      }
    
    

    render() {                                                       
        return (
          <div id='cartPage'>
            <NavbarHome 
              cartCount={this.state.cartCount}
            />
            <Cart 
              updateCart={this.getCart}
            />
          </div>
        )
    }
}

export default CartPage