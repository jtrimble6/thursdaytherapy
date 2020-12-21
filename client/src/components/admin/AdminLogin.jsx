import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, FormGroup, ControlLabel, FormControl, Button, Icon, Alert } from 'rsuite';
import NavbarHome from '../nav/NavbarHome.jsx'
import API from '../../utils/API'
// import SignInError from "../../components/alerts/SignInError";

// CSS
import '../../css/admin/adminLogin.css'

class AdminLogin extends Component {

    state = {
        username: '',
        password: '',
        redirect: false,
        signInError: false
    }

    componentDidMount() {
        // console.log('Ready')
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect === true) {
          return <Redirect to='/admin' />
        }
        else {}
    }

    handleInputChange = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
            signInError: false
        })
    }

    handleFormSubmit = event => {
        event.preventDefault()
        let userData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }

        API.loginUser(userData)
          .then(response => {
              if (response.status === 200) {
                //   console.log('Authenticated!')
                  let thisUser = response.data.username
                  this.props.updateUser({
                      loggedIn: true,
                      username: response.data.username
                  })
                  let sessionData = {
                      sessionUserID: response.data.username
                  }
                  API.createSession(sessionData)
                    .then(response => {
                        this.props.updateUser({
                            sessionID: response.data._id
                        })
                    }).catch(error => {
                        console.log('Admin Login Error: ', error)
                        this.setState({
                            signInError: true
                        })
                    })
                    API.getUser(thisUser)
                      .then(response => {
                        // console.log(response)
                        this.setRedirect()
                      })
              }
          }).catch(error => {
              this.setState({
                  signInError: true
              })
              Alert.error('Username or password is incorrect.', 10000)
              console.log('Admin Login Error: ', error)
          })
    }

    render() {
        return (
          <div>
            {/* <NavbarHome /> */}
            <div id="loginPage">
              {this.renderRedirect()}
                <div className="formContainer"> 
                    <h2 id="loginTitle" className="adminLoginFormHeading">Admin Login</h2>
                    <Form id='loginForm' action="index.html">
                      <FormGroup>
                        <ControlLabel className='loginFormLabel' htmlFor="username">Username</ControlLabel>
                        <FormControl 
                            name="username"
                            type="text"
                            className="form-control loginFormEntry"
                            id="username"
                            placeholder="Username (case sensitive)"                                    
                         />
                         <small id="usernameError" className="form-text text-muted">{this.state.nameTaken}</small>
                      </FormGroup>
                      <FormGroup>
                        <ControlLabel className='loginFormLabel' htmlFor="exampleInputPassword1">Password</ControlLabel>
                        <FormControl 
                            name="password"
                            type="password"
                            className="form-control loginFormEntry"
                            id="password"
                            placeholder="Password (case sensitive)"                                
                         />
                      </FormGroup>
                      <FormGroup>
                        <Button
                            type="submit"
                            className="adminSubmitButton"
                            onClick={this.handleFormSubmit}
                        >
                            SIGN IN <Icon icon='lock' />
                        </Button>
                      </FormGroup>
                    </Form>    	
                </div>
            </div>
          </div>
        )
    }
}

export default AdminLogin
       