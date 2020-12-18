import React, { Component } from 'react';
import { Form, FormGroup, ControlLabel, FormControl, ButtonToolbar, Button, Alert } from 'rsuite';
import axios from 'axios'

import ContactUsImage from '../../css/images/contactUsImage.jpeg'
import '../../css/contact/contactUs.css'


class ContactUsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
          
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.resetForm = this.resetForm.bind(this)
        this.sendEmail = this.sendEmail.bind(this)

    }

    componentDidMount() {
        
      }
    
    handleSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        this.sendEmail(name, email, message)
      }
    
    sendEmail = (name, email, message) => {
        // console.log(name, email, message)
        axios({
            method: "POST", 
            url: process.env.NODE_ENV === 'development' ? "http://localhost:3000/send" : "https://thursdaytherapy.herokuapp.com/send",
            data: {
                name: name,   
                email: email,  
                message: message
            }
        }).then((response)=> {
            if (response.data.msg === 'success'){
                // console.log("Message Sent."); 
                Alert.success('Your email has been sent!', 10000)
                this.setState({
                  contactSuccess: true
                })
                this.resetForm()
            } else if(response.data.msg === 'fail'){
              // console.log("Message failed to send.")
              Alert.error('Sorry, there was an error sending the email. Please try again.', 10000)
              this.setState({
                contactError: true
              })
            }
        })
        this.resetForm()
    }
  
    resetForm(){
        document.getElementById('contactForm').reset();
      }
    

    render() {                                                       
        return (
            // <div id='contactUsFormSpan'>
              <div id='contactUsImagesRow' className="row">
                <div className="col-sm contactUsImagesCol">
                  <img src={ContactUsImage} className="contactUsImage" alt="image1" />
                </div>
                <div className="col-sm contactUsFormCol">
                  <Form id='contactForm'>
                    <FormGroup>
                      <ControlLabel>Name*</ControlLabel>
                      <FormControl id='name' name="name" />
                      {/* <HelpBlock>Required</HelpBlock> */}
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Email*</ControlLabel>
                      <FormControl id='email' name="email" type="email" />
                      {/* <HelpBlock>Required</HelpBlock> */}
                      {/* <HelpBlock tooltip>Required</HelpBlock> */}
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Message*</ControlLabel>
                      {/* <HelpBlock>Required</HelpBlock> */}
                      <FormControl id='message' rows={5} name="textarea" componentClass="textarea" />
                    </FormGroup>
                    <FormGroup>
                    <ButtonToolbar>
                        <Button appearance="primary" onClick={this.handleSubmit}>Submit</Button>
                        <Button appearance="default" onClick={this.resetForm}>Cancel</Button>
                    </ButtonToolbar>
                    </FormGroup>
                  </Form>
                </div>
              </div>
            // </div>
        )
    }
}

export default ContactUsForm