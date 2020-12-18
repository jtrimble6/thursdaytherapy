import React, { Component } from 'react';
import { Panel, Icon } from 'rsuite';
import NavbarAdmin from '../nav/NavbarAdmin.jsx'
// import Admin from './Admin.jsx'
import AdminAdd from './AdminAdd.jsx'
import AdminDelete from './AdminDelete.jsx'
import '../../css/admin/adminTools.css'

class AdminTools extends Component {
    constructor(props) {
        super(props);

        this.state = {
          showAdminAddModal: false,
          showAdminDeleteModal: false
        }
        
        this.openAddAdmin = this.openAddAdmin.bind(this)
        this.openDeleteAdmin = this.openDeleteAdmin.bind(this)

    }

    componentDidMount() {
        
      }
    
    openAddAdmin = (e) => {
        e.preventDefault()
        // console.log('SHOW ADMIN ADD')
        this.setState({
          showAdminAddModal: true
        })
      }
    
    openDeleteAdmin = (e) => {
        e.preventDefault()
        // console.log('SHOW ADMIN DELETE')
        this.setState({
          showAdminDeleteModal: true
        })
      }

    render() {                                                       
        return (
          <div id='adminTools'>
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
                showAdminAddModal={this.state.showAdminAddModal}
              />

              <AdminDelete
                showAdminDeleteModal={this.state.showAdminDeleteModal}
              />

            </div>
              
            </span>
            
            
          </div>
        )
    }
}

export default AdminTools