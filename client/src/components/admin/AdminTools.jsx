import React, { Component } from 'react';

import NavbarAdmin from '../nav/NavbarAdmin.jsx'
// import Admin from './Admin.jsx'
import AdminAdd from './AdminAdd.jsx'


class AdminTools extends Component {
    constructor(props) {
        super(props);

        this.state = {
      
        }

    }

    componentDidMount() {
        
      }
    
    
    

    render() {                                                       
        return (
          <div id='products'>
            <NavbarAdmin />
            {/* <Admin /> */}
            <AdminAdd />
          </div>
        )
    }
}

export default AdminTools