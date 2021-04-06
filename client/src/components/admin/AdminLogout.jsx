import React, { Component } from 'react'

// CSS
import '../../css/admin/admin.css'

class AdminLogout extends Component {
  constructor(props) {
      super(props) 
      this.state = {
          username: ''
      }
      this.logout = this.logout.bind(this)
    }


    componentDidMount() {
        this.logout()
    }

    logout = () => {
        localStorage.clear()
    }

    
    render() {
        return (
            <div id="logoutPage">
             <h1>You have successfully logged out!</h1>
             <a href={process.env.NODE_ENV === 'development' ? '/' : 'https://www.thursday-therapy.com/'}>Back to Home</a>
            </div>
        )
    }
}

export default AdminLogout
       