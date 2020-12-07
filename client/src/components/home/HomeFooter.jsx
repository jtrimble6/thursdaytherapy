import React, { Component } from 'react';
import HomeFooterImage from '../../css/images/homeFooterImage2.jpeg'


import '../../css/home/footerHome.css'


class HomeFooter extends Component {
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
              <div id='footerImagesRow' className="row">
                <div id='footerImage1' className="col-sm footerImagesCol">
                  <img src={HomeFooterImage} className="homeFooterImage" alt="footerImage1" />
                </div>
                <div id='etsyLink' className="col-sm footerImagesCol">
                  {/* <a href="#">Find us on <strong>Etsy!</strong></a> */}
                </div>
                <div id='footerImage2' className="col-sm footerImagesCol">
                  <img src={HomeFooterImage} className="homeFooterImage" alt="footerImage2" />
                </div>
              </div>
            </span>
        )
    }
}

export default HomeFooter