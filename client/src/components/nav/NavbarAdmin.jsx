import React, { Component } from 'react';
import { Navbar, Nav } from 'rsuite';
import NavbarHeaderImage from '../../css/images/navbarHeaderImage.png'

import 'rsuite/dist/styles/rsuite-default.css';
import '../../css/nav/navbarHome.css'


class NavbarAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
      
        }

    }

    componentDidMount() {
        
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
                    <Nav.Item className='navbarHomeItems' href='/admin'>Home</Nav.Item>
                    <Nav.Item className='navbarHomeItems' href='/inventory'>Inventory</Nav.Item>
                    <Nav.Item className='navbarHomeItems' href='/purchases'>Purchases</Nav.Item>
                    <Nav.Item className='navbarHomeItems' href='/tools'>Admin Tools</Nav.Item>
                    <Nav.Item className='navbarHomeItems' href='/signout'>Sign Out</Nav.Item>
                </Nav>
                {/* <Nav pullRight>
                    <Nav.Item>Settings</Nav.Item>
                </Nav> */}
                </Navbar.Body>
            </Navbar>
        )
    }
}

export default NavbarAdmin