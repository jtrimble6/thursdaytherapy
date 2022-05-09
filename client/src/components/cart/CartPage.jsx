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
        this.getCart()
      }
    
    getCart = () => {
        // let localSessionID = localStorage.getItem('sessionID')
        // if (!localSessionID || localSessionID === null) {
        //   console.log('no session id')
        //   return
        // } 

        let int = 1
        let cart = []
        // console.log('counting cart')
        while (int <= localStorage.length) {
          let cartItem = "item" + int
          // console.log('cart item: ', int)
          if (localStorage.getItem(cartItem)) {
            let cartItemFound = JSON.parse(localStorage.getItem(cartItem))
            cart.push(cartItemFound)
          }
          int++
        }

        this.setState({
          cartCount: cart.length
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