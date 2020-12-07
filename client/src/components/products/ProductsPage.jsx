import React, { Component } from 'react';

import NavbarHome from '../nav/NavbarHome.jsx'
import Products from './Products.jsx'


class ProductsPage extends Component {
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
            <Products />
          </div>
        )
    }
}

export default ProductsPage