import React, { Component } from 'react';
import OurStoryImage1 from '../../css/images/ourStoryImage1.jpeg'
import OurStoryImage2 from '../../css/images/ourStoryImage2.jpg'

import '../../css/story/ourStory.css'


class OurStoryImages extends Component {
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
              <div id='ourStoryImagesRow' className="row">
                <div className="col-sm ourStoryImagesCol">
                  <img src={OurStoryImage1} className="ourStoryImage" alt="image1" />
                </div>
                <div className="col-sm ourStoryTextCol">
                    {/* <div className="row"> */}
                      <p className='ourStoryText'>Thursday Therapy is a homegrown soap company that is all about self-care through natural products.</p>
                    {/* </div> */}
                </div>
                <div className="col-sm ourStoryImagesCol">
                  <img src={OurStoryImage2} className="ourStoryImage" alt="image3" />
                </div>
              </div>
            </span>
        )
    }
}

export default OurStoryImages