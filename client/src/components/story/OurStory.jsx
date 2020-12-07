import React, { Component } from 'react';

import NavbarHome from '../nav/NavbarHome.jsx'
import OurStoryImages from './OurStoryImages.jsx'
import HomeFooter from '../home/HomeFooter.jsx'

class OurStory extends Component {
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
            <OurStoryImages />
            <HomeFooter />
          </div>
        )
    }
}

export default OurStory