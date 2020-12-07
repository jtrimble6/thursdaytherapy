import React, { Component } from 'react';
import NavbarHome from '../nav/NavbarHome.jsx'
import HowToBuyImages from './HowToBuyImages.jsx'
import HomeFooter from '../home/HomeFooter.jsx'

class HowToBuy extends Component {
    constructor(props) {
        super(props);

        this.state = {
      
        }

    }

    componentDidMount() {
        
      }
    
    
    

    render() {                                                       
        return (
          <div id='homepage'>
            <NavbarHome />
            <HowToBuyImages />
            <HomeFooter />
          </div>
        )
    }
}

export default HowToBuy