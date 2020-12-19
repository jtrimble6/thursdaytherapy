import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, FormGroup, ControlLabel, FormControl, Button, Modal, Alert } from 'rsuite';
import API from '../../utils/API'
// import Navbar from '../../nav/Navbar'

// CSS
import '../../css/admin/admin.css'

// COMPONENTS
// import ExistingAccount from "../../components/alerts/ExistingAccount";
// import PasswordError from '../../components/alerts/PasswordError';
// import AdminAddSuccess from '../../components/alerts/AdminAddSuccess'
// import AdminAddError from '../../components/alerts/AdminAddError'



class AdminAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        redirect: false,
        nameTaken: false,
        passwordError: false,
        adminAddError: false,
        adminAddSuccess: false,
      }
        this.setRedirect = this.setRedirect.bind(this)
        this.renderRedirect = this.renderRedirect.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleAdminAdd = this.handleAdminAdd.bind(this)
        this.checkPassword = this.checkPassword.bind(this)
        this.checkUserName = this.checkUserName.bind(this)
      
      }

    componentDidMount() {
        // console.log('Ready')
      }

    setRedirect = () => {
        // console.log("Redirect");
        this.setState({
          redirect: true
        })
      }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/admin' />
        }
      }

    handleInputChange = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
            adminAddError: false,
            adminAddSuccess: false,
            nameTaken: false,
            passwordError: false,
        })
      }

    checkPassword = event => {
        const password = event.target.value
        this.setState({
         confirmPassword: password
        })
        if (this.state.password !== password) {
            // console.log('THE PASSWORDS DO NOT MATCH')
            this.setState({
                passwordError: 'PASSWORDS DO NOT MATCH'
            })
        } else {
            this.setState({
                passwordError: 'PASSWORDS MATCH'
            })
        }

      }

    checkUserName = event => {
        const username = event.target.value;
        // console.log(username);
        this.setState({
            username: username
        });
        API.getUser(username)
        .then(res => {
            // console.log(res)
            if (!res.data[0]) {
                // console.log("Username available");
                this.setState({
                    nameTaken: "Username available"
                })
            } else {
                // console.log("Username unavailable");
                this.setState({
                    nameTaken: "Username unavailable"
                })
            }
        })
        .catch(error => {
            // console.log(error)
        })
      }

    handleAdminAdd = event => {
        this.setState({
            passwordError: false,
            nameTaken: false,
        })
        event.preventDefault();
        //console.log(this.state)
        let userData = { 
            admin: true,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        };
        // console.log(userData);
        if (document.getElementById('password').value !== document.getElementById('confirmPassword').value) {
            // console.log('THE PASSWORDS DO NOT MATCH')
            this.setState({
                passwordError: true
            })
        } else {
          API.getUser(userData.username)
            .then(res => {
                // console.log(res)
                if (!res.data[0]) {
                    // console.log("Username available");
                    API.saveUser(userData)
                        .then(res => {
                            // console.log(res)
                            if (res.data) {
                                // console.log("Successful signup!")
                                Alert.success('Admin successfully added!', 5000)
                                this.setState({
                                    adminAddSuccess: true,
                                })
                                document.getElementById('adminAddForm').reset();
                                this.props.getAdmins()
                                // this.setRedirect();
                            } else {
                                // console.log("Signup error")
                                Alert.error('There was an error adding admin. Please try again.', 5000)
                                this.setState({
                                    adminAddError: true
                                })
                                this.props.getAdmins()
                            }
                        })
                        .catch(error => {
                            // console.log('Backend error: ', error)
                            Alert.error('There was an error adding admin. Please try again.', 5000)
                            this.setState({
                                adminAddError: true
                            })
                        })
                } else {
                    // console.log("Username taken");
                    this.setState({
                        nameTaken: true
                    })
                }})
                .catch(error => {
                    Alert.error('There was an error adding admin. Please try again.', 5000)
                    // console.log(error)
                })
        }
        
      }

    render() {
        return (
            <div id="adminAddPage">
              {/* {this.renderRedirect()} */}
                  <Modal id="adminAddModal" show={this.props.showAdminAddModal} onHide={this.props.closeAdminAddModal}>
                    <Modal.Header>
                      <Modal.Title>Admin Add</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form id='adminAddForm' action="index.html">
                        <h2 id="adminAddFormHeading" className="adminAddFormHeading">Admin Add</h2>
                        <FormGroup className="adminAddFormGroup">
                            <ControlLabel className='adminAddFormLabel' htmlFor="firstName">First Name</ControlLabel>
                            <FormControl 
                                // value={this.state.firstName}
                                name="firstName"
                                // onChange={this.handleInputChange}
                                type="text"
                                className="form-control adminAddFormEntry"
                                id="firstName"
                                placeholder="First name" 
                            />
                            {/* <HelpBlock>Required</HelpBlock> */}
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel className='adminAddFormLabel' htmlFor="lastName">Last Name</ControlLabel>
                            <FormControl 
                                // value={this.state.lastName}
                                name="lastName"
                                // onChange={this.handleInputChange}
                                type="text"
                                className="form-control adminAddFormEntry"
                                id="lastName"
                                placeholder="Last name"                                        
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel className='adminAddFormLabel' htmlFor="email">Email</ControlLabel>
                            <FormControl 
                                // value={this.state.email}
                                name="email"
                                // onChange={this.handleInputChange}
                                type="text"
                                className="form-control adminAddFormEntry"
                                id="email"
                                placeholder="Email"                                    
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel className='adminAddFormLabel' htmlFor="username">Username</ControlLabel>
                            <FormControl 
                                // value={this.state.username}
                                name="username"
                                // onChange={this.checkUserName}
                                type="text"
                                className="form-control adminAddFormEntry"
                                id="username"
                                placeholder="Username"                                    
                            />
                            <small id="usernameError" className="form-text text-muted">{this.state.nameTaken}</small>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel className='adminAddFormLabel' htmlFor="exampleInputPassword1">Create Password</ControlLabel>
                            <FormControl 
                                // value={this.state.password}
                                name="password"
                                // onChange={this.handleInputChange}
                                type="password"
                                className="form-control adminAddFormEntry"
                                id="password"
                                placeholder="Password"                                
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel className='adminAddFormLabel' htmlFor="exampleInputPassword1">Confirm Password</ControlLabel>
                            <FormControl 
                                // value={this.state.confirmPassword}
                                name="confirmPassword"
                                // onChange={this.checkPassword}
                                type="password"
                                className="form-control adminAddFormEntry"
                                id="confirmPassword"
                                placeholder="Confirm Password"                                 
                            />
                            <small id="passwordError" className="form-text text-muted">{this.state.passwordError}</small>
                        </FormGroup>
                        <FormGroup>
                            
                        </FormGroup>
                      </Form>
                      {/* <img src={"http://localhost:3000/" + this.state.soapImage} data-soapname='Peacock Z' onClick={this.openEditModal} className="productsImageModal" alt="peacockZ1" /> */}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        type="submit"
                        className="adminSubmitButton"
                        onClick={this.handleAdminAdd}
                      >
                        Create Admin
                      </Button>
                      <Button 
                        onClick={this.props.closeAdminAddModal}
                      >
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>



                {/* <div id="adminAddForm" className="formContainer">   
                    <h2 id="adminAddFormHeading" className="adminAddFormHeading" action="index.html">Admin Add</h2>
                    
                </div> */}
            </div>
        
        )
    }
}

export default AdminAdd;
       
