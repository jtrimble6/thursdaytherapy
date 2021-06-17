import React, { Component } from 'react';
import HomeImage1 from '../../css/images/homeImage1.jpg'
import HomeImage2 from '../../css/images/homeImage2.jpg'
import HomeImage3 from '../../css/images/homeImage3.jpg'
import HowToBuyImage1 from '../../css/images/howToBuyImage1.jpeg'
import HowToBuyImage2 from '../../css/images/howToBuyImage2.jpeg'

import '../../css/home/home.css'


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
                  <img src={HowToBuyImage2} className="homeImage" id='homeImage1' alt="image1" />
                </div>
                <div className="col-sm homeImagesCol">
                  <img src={HomeImage1} className="homeImage" id='homeImage2' alt="image2" />
                </div>
                <div className="col-sm homeImagesCol">
                  <img src={HowToBuyImage1} className="homeImage" id='homeImage3' alt="image3" />
                </div>
              </div>
            </span>
        )
    }
}

export default HomeImages