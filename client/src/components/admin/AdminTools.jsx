import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { Panel, Icon, Alert } from 'rsuite';
import NavbarAdmin from '../nav/NavbarAdmin.jsx'
import API from '../../utils/API'
import AdminAdd from './AdminAdd.jsx'
import AdminDelete from './AdminDelete.jsx'
import '../../css/admin/adminTools.css'

class AdminTools extends Component {
    constructor(props) {
        super(props);

        this.state = {
          redirect: false,
          showAdminAddModal: false,
          showAdminDeleteModal: false,
          admins: []
        }
        
        this.setRedirect = this.setRedirect.bind(this)
        this.renderRedirect = this.renderRedirect.bind(this)
        this.openAddAdmin = this.openAddAdmin.bind(this)
        this.closeAddAdmin = this.closeAddAdmin.bind(this)
        this.closeDeleteAdmin = this.closeDeleteAdmin.bind(this)
        this.openDeleteAdmin = this.openDeleteAdmin.bind(this)
        this.getAdmins = this.getAdmins.bind(this)

    }

    componentDidMount() {
        let localSessionID = localStorage.getItem('sessionID')
        console.log('CHECKING SESSION ID:')
        console.log(localSessionID)
        if (!localSessionID || localSessionID === null) {
          this.setRedirect()
        } else {
          this.getAdmins()
        }
        
      }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
      }
  
    renderRedirect = () => {
        if (this.state.redirect === true) {
          return <Redirect to='/login' />
        }
        else {}
      }

    getAdmins = () => {
        API.getUsers()
            .then(res => {
                // console.log('ADMINS: ', res.data)
                this.setState({
                    admins: res.data
                })
            })
            .catch(err => {
              Alert.error('There was an error loading admins. Please reload page.', 10000)
              console.log('ERROR: ', err)
            })
      }
      
    openAddAdmin = (e) => {
        e.preventDefault()
        this.setState({ showAdminAddModal: true })
      }
      
    closeAddAdmin() {
        this.getAdmins()
        this.setState({ showAdminAddModal: false });
      }
    
    openDeleteAdmin = (e) => {
        e.preventDefault()
        this.setState({ showAdminDeleteModal: true })
      }

    closeDeleteAdmin() {
        this.getAdmins()
        this.setState({ showAdminDeleteModal: false });
      }

    render() {                                                       
        return (
          <div id='adminTools'>
            {this.renderRedirect()}
            <NavbarAdmin />
            <span>
              
            <div className="row adminToolsTitleRow">
              <p className='adminToolsTitle'>Admin Tools</p>
            </div>
            <div id='adminToolsImagesRow1' className="row">
              
              {/* <Admin /> */}
              <Panel className='adminToolsPanel adminToolsImagePanel' shaded bordered bodyFill={true} style={{ display: 'inline-block' }}>
                <Icon icon='plus-square' onClick={this.openAddAdmin} className="adminToolsImage" />
                  <Panel className='adminToolsImageHeader' header="Add Admin"></Panel>
              </Panel>
              <Panel className='adminToolsPanel adminToolsImagePanel' shaded bordered bodyFill={true} style={{ display: 'inline-block' }}>
                <Icon icon='minus-square' onClick={this.openDeleteAdmin} className="adminToolsImage" />
                  <Panel className='adminToolsImageHeader' header="Delete Admin"></Panel>
              </Panel>
              
              <AdminAdd 
                getAdmins={this.getAdmins}
                showAdminAddModal={this.state.showAdminAddModal}
                closeAdminAddModal={this.closeAddAdmin}
              />

              <AdminDelete
                getAdmins={this.getAdmins}
                admins={this.state.admins}
                showAdminDeleteModal={this.state.showAdminDeleteModal}
                closeAdminDeleteModal={this.closeDeleteAdmin}
              />

            </div>
              
            </span>
            
            
          </div>
        )
    }
}

export default AdminTools