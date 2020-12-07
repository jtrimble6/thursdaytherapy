import axios from 'axios'

export default {
    // USER API
    getUsers: function() {
        return axios.get('/api/users/')
    },
    getUser: function(id) {
        return axios.get('/api/users/' + id)
    },
    updateUserPassword: function(id, passwordData) {
        return axios.put('/api/users/updatePassword/' + id, passwordData)
    },
    deleteUser: function(id) {
        return axios.delete('/api/users/' + id)
    },
    saveUser: function(userData) {
        return axios.post('/api/users', userData)
    },
    loginUser: function(userData) {
        return axios.post('/api/users/login', userData)
    },
    createSession: function(sessionData) {
        return axios.post('/api/sessions', sessionData)
    },
    logout: function(sessionData) {
        return axios.delete('/api/sessions', sessionData)
    },
    checkSession: function(id, localSessionID) {
        return axios.get('/api/sessions/' + id, localSessionID)
    },
    // PASSWORD RESET API CALLS
    updatePassToken: function(username, passInfo) {
        return axios.put('/api/passwordReset/' + username, passInfo)
    },
    updatePassword: function(username, newPassword) {
        return axios.put('/api/updatePassword/' + username, newPassword)
    },


    submitOrder: function(orderData) {
        return axios.post('/api/purchases', orderData)
    },

    getPurchases: function() {
        return axios.get('/api/purchases/')
    },
}
