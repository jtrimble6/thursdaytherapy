import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, FormGroup, Dropdown, Button, Modal, Alert } from 'rsuite';
import API from '../../utils/API'
// import Navbar from '../../nav/Navbar'

// CSS
import '../../css/admin/admin.css'

// COMPONENTS
// import ExistingAccount from "../../components/alerts/ExistingAccount";
// import PasswordError from '../../components/alerts/PasswordError';
// import AdminDeleteSuccess from '../../components/alerts/AdminDeleteSuccess'
// import AdminDeleteError from '../../components/alerts/AdminDeleteError'



class AdminDelete extends Component {
    constructor(props) {
        super(props)
        this.state = {
        admins: [],
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectAdminTitle: 'Select Admin',
        selectAdminId: '',
        redirect: false,
        nameTaken: false,
        passwordError: false,
        adminDeleteError: false,
        adminDeleteSuccess: false,
      }
        this.setRedirect = this.setRedirect.bind(this)
        this.renderRedirect = this.renderRedirect.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleAdminDelete = this.handleAdminDelete.bind(this)
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
            adminDeleteError: false,
            adminDeleteSuccess: false,
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
            console.log(error)
        })
      }

    handleAdminDelete = event => {
        event.preventDefault()
        API.deleteUser(this.state.selectAdminId)
            .then(res => {
                // console.log('DELETE ADMIN RESULT: ', res)
                Alert.success('Admin was succesfully removed!', 5000)
                document.getElementById('adminDeleteForm').reset();
                this.props.closeAdminDeleteModal()
                this.props.getAdmins()
            })
            .catch(err => {
              Alert.error('There was an error removing admin. Please try again.', 5000)
              console.log('ERROR DELETING ADMIN: ', err)
              this.setState({
                selectAdminTitle: 'Select Admin',
                selectAdminId: '',
              })
              this.props.getAdmins()
            })
        
      }

    selectAdmin = (e) => {
        // console.log('SELECTED THIS ADMIN: ', e.target.dataset.username )
        this.setState({
            selectAdminTitle: e.target.dataset.username,
            selectAdminId: e.target.dataset.adminid
        })
      }

    render() {
        return (
            <div id="adminDeletePage">
              {/* {this.renderRedirect()} */}
                  <Modal id="adminDeleteModal" show={this.props.showAdminDeleteModal} onHide={this.props.closeAdminDeleteModal}>
                    <Modal.Header>
                      <Modal.Title>Admin Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id='adminDeleteModalBody'>
                    <Form id='adminDeleteForm' action="index.html">
                        {/* <h2 id="adminDeleteFormHeading" className="adminDeleteFormHeading">Admin Delete</h2> */}
                        <FormGroup className="adminDeleteFormGroup">
                            {/* <ControlLabel className='adminDeleteFormLabel' htmlFor="adminUsername">First Name</ControlLabel> */}
                            <Dropdown id='selectAdminDropdown' title={this.state.selectAdminTitle} placement="bottomStart">
                                {this.props.admins.map(admin => {
                                    return <Dropdown.Item key={admin._id} data-username={admin.username} data-adminid={admin._id} onClick={this.selectAdmin} value={admin.username}>{admin.username}</Dropdown.Item>
                                })}
                            </Dropdown>
                            {/* <HelpBlock>Required</HelpBlock> */}
                        </FormGroup>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        type="submit"
                        className="adminSubmitButton"
                        onClick={this.handleAdminDelete}
                      >
                        Delete Admin
                      </Button>
                      <Button 
                        onClick={this.props.closeAdminDeleteModal}
                      >
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Modal>
            </div>
        
        )
    }
}

export default AdminDelete;
       
