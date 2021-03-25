import React, { Component } from 'react';

import NavbarHome from '../nav/NavbarHome.jsx'
import HomeImages from './HomeImages.jsx'
import HomeFooter from './HomeFooter.jsx'

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
      
        }

    }

    componentDidMount() {
        let localSessionID = localStorage.getItem('sessionID')
        if (localSessionID) {
          localStorage.clear()
        }
      }
    
    
    

    render() {                                                       
        return (
          <div id='homepage'>
            <NavbarHome />
            <HomeImages />
            <HomeFooter />
          </div>
        )
    }
}

export default Home