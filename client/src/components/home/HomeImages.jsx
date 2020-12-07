import React, { Component } from 'react';
import HomeImage1 from '../../css/images/homeImage1.jpg'
import HomeImage2 from '../../css/images/homeImage2.jpg'
import HomeImage3 from '../../css/images/homeImage3.jpg'

import '../../css/home/footerHome.css'


class HomeImages extends Component {
    constructor(props) {
        super(props);

        this.state = {
      
        }

    }

    componentDidMount() {
        
      }
    
    
    

    render() {                                                       
        return (
            <span>
              <div id='homeImagesRow' className="row">
                <div className="col-sm homeImagesCol">
                  <img src={HomeImage1} className="homeImage" alt="image1" />
                </div>
                <div className="col-sm homeImagesCol">
                  <img src={HomeImage2} className="homeImage" alt="image2" />
                </div>
                <div className="col-sm homeImagesCol">
                  <img src={HomeImage3} className="homeImage" alt="image3" />
                </div>
              </div>
            </span>
        )
    }
}

export default HomeImages