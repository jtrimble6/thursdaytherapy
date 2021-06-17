import React, { Component } from 'react';
import { Modal, Button} from 'rsuite';
import HowToBuyImage1 from '../../css/images/howToBuyImage1.jpeg'
import HowToBuyImage2 from '../../css/images/howToBuyImage2.jpeg'

import '../../css/howToBuy/howToBuy.css'


class HowToBuy extends Component {
    constructor(props) {
        super(props);

        this.state = {
          show: false
        }

        this.showPhoneModal = this.showPhoneModal.bind(this)
        this.close = this.close.bind(this)

    }

    componentDidMount() {
        
      }
  
    showPhoneModal = (e) => {
      e.preventDefault()
      this.setState({
        show: true
      })
    }

    close() {
      this.setState({
        show: false
      })
    }
    
    

    render() {                                                       
        return (
            <span>
              <div id='howToBuyImagesRow' className="row">
                <div className="col-sm-6 howToBuyTextCol">
                    <div className="row">
                      <a href='/products' className='howToBuyText'>Order securely using our site!</a>
                    </div> <hr />
                    <div className="row">
                      <a href='https://brossmansfarm.com/' rel='noreferrer' target='_blank' className='howToBuyText'>See our soaps at Brossman's Farm in Leesburg, VA</a>
                    </div> <hr />
                    <div className="row contactRow">
                    <Modal id='contactUsPhone' show={this.state.show} onHide={this.close}>
                      {/* <Modal.Header>
                          <Modal.Title id='productsListingName'>{this.state.soapName}</Modal.Title>
                      </Modal.Header> */}
                      <Modal.Body>
                        <h2 id='contactUsPhoneHeader'>Phone Number:</h2>
                        <p id='contactUsPhoneNumber'>703-729-####</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button onClick={this.close} appearance="subtle">
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                      {/* <Button onClick={this.showPhoneModal} className='howToBuyCallButton'>Call us!</Button> */}
                    </div>
                    <div className="row">
                      <div className="col howToBuyImagesCol1">
                        <img src={HowToBuyImage2} className="howToBuyImage" alt="image3" />
                      </div>
                    </div>
                </div>
                <div className="col-sm-6 howToBuyImagesCol">
                  <img src={HowToBuyImage1} className="howToBuyImage" alt="image1" />
                </div>
                {/* <div className="col-sm howToBuyImagesCol">
                  <img src={HowToBuyImage2} className="howToBuyImage" alt="image3" />
                </div> */}
              </div>
            </span>
        )
    }
}

export default HowToBuy