import React, { Component } from 'react';
import HowToBuyImage1 from '../../css/images/howToBuyImage1.jpeg'
import HowToBuyImage2 from '../../css/images/howToBuyImage2.jpeg'

import '../../css/howToBuy/howToBuy.css'


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
            <span>
              <div id='howToBuyImagesRow' className="row">
                <div className="col-sm howToBuyImagesCol">
                  <img src={HowToBuyImage1} className="howToBuyImage" alt="image1" />
                </div>
                <div className="col-sm howToBuyTextCol">
                    <div className="row">
                      <a href='/products' className='howToBuyText'>Order securely using our site!</a>
                    </div> <hr />
                    <div className="row">
                      <a href='https://brossmansfarm.com/' rel='noreferrer' target='_blank' className='howToBuyText'>See our soaps at Brossman's Farm in Leesburg, VA</a>
                    </div> <hr />
                    <div className="row">
                      <a href='#' className='howToBuyText'>Call us!</a>
                    </div>
                </div>
                <div className="col-sm howToBuyImagesCol">
                  <img src={HowToBuyImage2} className="howToBuyImage" alt="image3" />
                </div>
              </div>
            </span>
        )
    }
}

export default HowToBuy