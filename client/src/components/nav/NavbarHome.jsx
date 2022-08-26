import React, { Component } from 'react';
import { Navbar, Nav, Icon, Badge } from 'rsuite';
import NavbarHeaderImage from '../../css/images/navbarHeaderImage.png';

import 'rsuite/dist/styles/rsuite-default.css';
import '../../css/nav/navbarHome.css';


class NavbarHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
          cartCount: ''
        }

        this.getCart = this.getCart.bind(this)
        this.countCart = this.countCart.bind(this)
    }

    componentDidMount() {
        this.countCart()
      }

    countCart = () => {
      // let localSessionID = localStorage.getItem('sessionID')
      // if (!localSessionID || localSessionID === null) {
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
    
    getCart = () => {
        
      }
    

    render() {                                                       
        return (
            <Navbar id='navbarHome'>
                {/* <Navbar.Header id='navbarHomeHeader'>
                  <img src={NavbarHeaderImage} className="navbar-brand Navbar-logo" alt="NavbarHeaderImg" />
                </Navbar.Header> */}
                <Navbar.Body id='navbarHomeBody'>
                <img src={NavbarHeaderImage} id="navbarHomeLogo" className="navbar-brand Navbar-logo" alt="NavbarHeaderImg" />
                <Nav id='navbarHomeTabs'>
                    <Nav.Item className='navbarHomeItems' href='/'>Home</Nav.Item>
                    <Nav.Item className='navbarHomeItems' href='/products'>Products</Nav.Item>
                    <Nav.Item className='navbarHomeItems' href='/ourstory'>Our Story</Nav.Item>
                    <Nav.Item className='navbarHomeItems' href='/howtobuy'>How to Buy</Nav.Item>
                    <Nav.Item className='navbarHomeItems' href='/contactus'>Contact Us</Nav.Item>
                    <Nav.Item 
                      className='navbarHomeItems' 
                      id='navbarHomeCart' 
                      href='/shoppingcart'
                    >
                        <Icon icon='shopping-cart' />
                        <Badge 
                          id="cartCount" 
                          className="badge badge-warning" 
                          content={this.props.cartCount > 0 ? this.props.cartCount : this.state.cartCount > 0 ? this.state.cartCount : ''}
                        />
                    </Nav.Item>
                    {/* <Dropdown title="About">
                    <Dropdown.Item>Company</Dropdown.Item>
                    <Dropdown.Item>Team</Dropdown.Item>
                    <Dropdown.Item>Contact</Dropdown.Item>
                    </Dropdown> */}
                </Nav>
                {/* <Nav pullRight>
                    <Nav.Item>Settings</Nav.Item>
                </Nav> */}
                
                </Navbar.Body>
                <p className='disclaimer'>Sorry for the inconvenience while our website is under construction, if you have any questions send us a note <a href='/contactus'>here</a>.</p>
            </Navbar>
        )
    }
}

export default NavbarHome