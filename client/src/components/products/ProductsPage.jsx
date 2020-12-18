import React, { Component } from 'react';

import NavbarHome from '../nav/NavbarHome.jsx'
import Products from './Products.jsx'


class ProductsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
          cartCount: 0
        }
        this.getCart = this.getCart.bind(this)
        // this.updateCart = this.updateCart.bind(this)

    }

    componentDidMount() {
        this.getCart()
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
          <div id='products'>
            <NavbarHome 
              cartCount={this.state.cartCount}
            />
            <Products 
              updateCart={this.getCart}
            />
          </div>
        )
    }
}

export default ProductsPage