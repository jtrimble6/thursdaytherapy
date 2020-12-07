import React, { Component } from 'react';

import NavbarHome from '../nav/NavbarHome.jsx'
import ContactUsForm from './ContactUsForm.jsx'
import HomeFooter from '../home/HomeFooter.jsx'

class ContactUs extends Component {
    constructor(props) {
        super(props);

        this.state = {
      
        }

    }

    componentDidMount() {
        
      }
    
    
    

    render() {                                                       
        return (
          <div id='contact'>
            <NavbarHome />
            <ContactUsForm />
            <HomeFooter />
          </div>
        )
    }
}

export default ContactUs