import React, { Component } from 'react';
import { Modal, FormGroup, ControlLabel, FormControl, Button, Table, Row, Icon, Alert } from 'rsuite';
import { Form } from 'react-bootstrap'
import API from '../../utils/API'
import NavbarAdmin from '../nav/NavbarAdmin.jsx'
import moment from 'moment'
import '../../css/admin/purchases.css'

const normalizeInput = (value, previousValue) => {
    // console.log('normalizing input')
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;
    
    if (!previousValue || value.length > previousValue.length) {
      if (cvLength < 4) return currentValue;
      if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
    }
  };


class Purchases extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPurchases: [],
            filteredPurchases: [],
            showDetails: false,
            showEditDetails: false,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            phoneError: false,
            email: '',
            purchaseDate: '',
            confirmationNumber: '',
            orderId: '',
            purchaseId: '',
            purchaseDetails: [],
            purchaseTotal: ''

        }

        this.getPurchases = this.getPurchases.bind(this)
        this.handleUpdateOrder = this.handleUpdateOrder.bind(this)
        this.openDetails = this.openDetails.bind(this)
        this.closeDetails = this.closeDetails.bind(this)
        this.closeEditDetails = this.closeEditDetails.bind(this)
        this.openEditDetails = this.openEditDetails.bind(this)
        this.handleEditDetails = this.handleEditDetails.bind(this)
        this.handleSearchEntry = this.handleSearchEntry.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
    }

    componentDidMount() {
        this.getPurchases()
      }
    
    getPurchases = () => {
      API.getPurchases()
        .then(res => {
            // console.log('PURCHASES: ', res.data)
            let purchases = res.data
            for (let p=0; p<purchases.length; p++) {
                let purchaseDate = purchases[p].purchaseDate
                purchases[p].purchaseDate = moment(purchaseDate).format('MM/DD/YYYY')
            }
            // console.log('NEW PURCHASES: ', purchases)
            this.setState({
                currentPurchases: purchases,
                filteredPurchases: purchases
            })
        })
        .catch(err => {
            Alert.error('There was an error loading the purchases. Please reload page.', 10000)
            console.log('ERROR GETTING PURCHASES: ', err)
        })
      }

    handleUpdateOrder = () => {
      let orderId = this.state.orderId
      let orderDetails = {
          'firstName': this.state.firstName,
          'lastName': this.state.lastName,
          'email': this.state.email,
          'phoneNumber': this.state.phoneNumber
      }

      API.updateOrder(orderId, orderDetails)
        .then(res => {
            // console.log('UPDATE ORDER RESULT', res)
            // window.location.reload()
            Alert.success('Order was successfully updated!', 5000)
            this.closeEditDetails()
        })
        .catch(err => {
            Alert.error('There was an error updating the product. Please retry.', 10000)
            console.log('ERROR GETTING PURCHASES: ', err)
        })
      }

    closeDetails() {
        this.getPurchases()
        this.setState({ showDetails: false });
      }

    closeEditDetails() {
        this.getPurchases()
        this.setState({ showEditDetails: false });
      }

    async handleEditDetails() {
        document.getElementById('firstName').disabled = false
        document.getElementById('lastName').disabled = false
        document.getElementById('phoneNumber').disabled = false
        document.getElementById('email').disabled = false
      }

    handleEditPurchases = event => {
        // console.log(event)
        // console.log('NEW ORDER FIRST NAME: ', event.firstName)
        // console.log('NEW ORDER LAST NAME: ', event.lastName)
        // console.log('NEW ORDER PHONE NUMBER: ', event.phoneNumber)
        // console.log('NEW ORDER EMAIL: ', event.email)
        this.setState({
            firstName: event.firstName !== undefined ? event.firstName : this.state.firstName,
            lastName: event.lastName !== undefined ? event.lastName : this.state.lastName,
            phoneNumber: event.phoneNumber !== undefined ? event.phoneNumber : this.state.phoneNumber,
            email: event.email !== undefined ? event.email : this.state.email
        })
      }

    openEditDetails = (e) => {
        let targetPurchase = e.target
        let purchases = this.state.currentPurchases
        // console.log('CURRENT PURCHASES: ', purchases)
        let purchaseId = targetPurchase.dataset.product
        let purchase = purchases.filter(purchase => {
            return purchase._id === purchaseId
        })
        let orderId = purchase[0]._id
        let purchaseDetails = purchase[0].purchaseDetails
        let purchaseTotal = 0
        for (let i=0; i<purchaseDetails.length; i++) {
            let purchaseItem = purchaseDetails[i]
            let purchaseItemTotal = purchaseItem.soapTotal
            purchaseTotal = purchaseTotal + purchaseItemTotal
        }
        // let soapProductId = soap[0].productId._id
        // let soapName = soap[0].productId.name
        // console.log('PURCHASE SELECTED: ', purchase)
        // console.log('PURCHASE DETAILS: ', purchaseDetails)
        // console.log('PURCHASE TOTAL: ', purchaseTotal)
        // document.getElementById('purchaseId').disabled = false
        // document.getElementById('phoneNumber').disabled = false
        // console.log('SOAP NAME: ', soapName)
        // console.log('TARGET PURCHASE: ', targetPurchase)
        this.setState({
            orderId: orderId,
            purchaseId: purchase[0].purchaseId,
            confirmationNumber: purchase[0].confirmationNumber,
            firstName: purchase[0].firstName,
            lastName: purchase[0].lastName,
            phoneNumber: purchase[0].phoneNumber,
            email: purchase[0].email,
            purchaseDate: purchase[0].purchaseDate,
            purchaseDetails: purchaseDetails,
            purchaseTotal: purchaseTotal,
            showEditDetails: true
        })
      }

    openDetails = (e) => {
        let targetPurchase = e.target
        let purchases = this.state.currentPurchases
        // console.log('CURRENT PURCHASES: ', purchases)
        let purchaseId = targetPurchase.dataset.product
        let purchase = purchases.filter(purchase => {
            return purchase._id === purchaseId
        })
        let purchaseDetails = purchase[0].purchaseDetails
        let purchaseTotal = 0
        for (let i=0; i<purchaseDetails.length; i++) {
            let purchaseItem = purchaseDetails[i]
            let purchaseItemTotal = purchaseItem.soapTotal
            purchaseTotal = purchaseTotal + purchaseItemTotal
        }
        // let soapProductId = soap[0].productId._id
        // let soapName = soap[0].productId.name
        // console.log('PURCHASE SELECTED: ', purchase)
        // console.log('PURCHASE DETAILS: ', purchaseDetails)
        // console.log('PURCHASE TOTAL: ', purchaseTotal)
        // console.log('SOAP NAME: ', soapName)
        // console.log('TARGET PURCHASE: ', targetPurchase)
        this.setState({
            purchaseId: purchase[0].purchaseId,
            confirmationNumber: purchase[0].confirmationNumber,
            firstName: purchase[0].firstName,
            lastName: purchase[0].lastName,
            phoneNumber: purchase[0].phoneNumber,
            email: purchase[0].email,
            purchaseDate: purchase[0].purchaseDate,
            purchaseDetails: purchaseDetails,
            purchaseTotal: purchaseTotal,
            showDetails: true
        })
        
      }

    handleSearchEntry = event => {
        // console.log(event)
        // console.log('NEW SEARCH ENTRY: ', event.searchEntry)
        let purchases = this.state.currentPurchases
        let newSearchEntry = event.searchEntry
        if(newSearchEntry === '') {
          this.getPurchases()
        }
        let filteredPurchases = purchases.filter(purchase => {
          return (purchase.firstName.toLowerCase().includes(newSearchEntry.toLowerCase()) || purchase.lastName.toLowerCase().includes(newSearchEntry.toLowerCase()))
        })
        this.setState({
          filteredPurchases: filteredPurchases
        })
      }

    handlePhoneChange({ target: { value } }) {
        // this.setState({
        //   stepOneFieldError: false,
        //   changeStepError: false
        // })    
        this.setState(prevState=> ({ phoneNumber: normalizeInput(value, prevState.phoneNumber) }));
        if (value.length !== 14) {
          console.log('PHONE VALUE: ', value)
          this.setState({
            phoneError: true
          })
        } else {
          this.setState({
            phoneError: false
          })
        }
      }

    render() {            
        const { Column, HeaderCell, Cell } = Table;                                                                                             
        return (
          <div id='purchases'>
            <NavbarAdmin />
              <span>
                <div className="row purchasesTitleRow">
                  <p className='purchasesTitle'>Purchases</p>
                  {/* SEARCH BAR */}
                  <Form id='adminPurchasesSearchBarForm' onChange={(event) => this.handleSearchEntry(event)}>
                    <FormGroup id='adminPurchasesSearchBarFormGroup'>
                      <FormControl 
                        name="searchEntry"
                        type="text"
                        className="form-control purchasesSearchBarFromEntry"
                        id="searchEntry"
                        placeholder="Search by first or last name" 
                      />
                      <Icon className='searchIcon' icon='search' size="lg" />
                    </FormGroup>
                  </Form>
                </div>

                <div id='purchaseRow' className="row">
                
                {/* EDIT DETAILS MODAL */}
                <Modal 
                  size="md"
                  show={this.state.showEditDetails} 
                  onHide={this.closeEditDetails} 
                  id='openPurchasesDetailModal'
                >
                    <Modal.Header>
                        <Modal.Title>{this.state.soapName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form id='purchaseForm' onChange={(event) => this.handleEditPurchases(event)}>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="firstName">First Name</ControlLabel>
                            <FormControl 
                                disabled
                                name="firstName"
                                type="text"
                                className="form-control purchaseFormEntry"
                                id="firstName"
                                value={this.state.firstName}                                    
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="lastName">Last Name</ControlLabel>
                            <FormControl 
                                disabled
                                name="lastName"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="lastName"
                                value={this.state.lastName}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="phoneNumber">Phone #</ControlLabel>
                            <Form.Control  
                                disabled
                                name="phoneNumber"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="phoneNumber"
                                value={this.state.phoneNumber}         
                                onChange={this.handlePhoneChange}                     
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="email">Email</ControlLabel>
                            <FormControl 
                                disabled
                                name="email"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="email"
                                value={this.state.email}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="purchaseDate">Purchase Date</ControlLabel>
                            <FormControl 
                                disabled
                                name="purchaseDate"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="purchaseDate"
                                value={this.state.purchaseDate}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="purchaseId">Purchase ID</ControlLabel>
                            <FormControl 
                                disabled
                                name="purchaseId"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="purchaseId"
                                value={this.state.purchaseId}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="confirmationNumber">Confirmation #</ControlLabel>
                            <FormControl 
                                disabled
                                name="confirmationNumber"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="confirmationNumber"
                                value={this.state.confirmationNumber}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                          <Table
                            className='purchaseDetailsTable'
                            // height={400}
                            data={this.state.purchaseDetails}
                            renderEmpty={() => <div id='emptyPurchasesTitle'>No Matching Data</div>}
                            onRowClick={data => {
                                // console.log('PURCHASE TABLE DETAILS: ', data);
                            }}

                            >
                        
                            <Column flexGrow={1} width={200} resizable>
                                <HeaderCell>Product Name</HeaderCell>
                                <Cell dataKey="soapName" />
                                {/* <Cell>{(rowData, rowIndex) => {return rowData.productId.name}}</Cell> */}
                            </Column>

                            <Column flexGrow={1} width={70}>
                                <HeaderCell>Quanity</HeaderCell>
                                <Cell dataKey="soapQty" />
                            </Column>

                            <Column flexGrow={1} width={70}>
                                <HeaderCell>Price</HeaderCell>
                                <Cell>{(rowData) => {return "$" + rowData.soapPrice}}</Cell>
                                {/* <Cell dataKey="soapPrice" /> */}
                            </Column>

                            <Column flexGrow={1} width={70}>
                                <HeaderCell>Total</HeaderCell>
                                <Cell>{(rowData) => {return "$" + rowData.soapTotal}}</Cell>
                                {/* <Cell dataKey="total" /> */}
                            </Column>

                            {/* <Column width={100} resizable>
                                <HeaderCell>Order ID</HeaderCell>
                                <Cell dataKey="_id" />
                            </Column> */}

                            {/* <Column width={250} resizable>
                                <HeaderCell>Product ID</HeaderCell>
                                <Cell dataKey="soapId" />
                            </Column> */}

                          </Table>
                        </FormGroup>
                      </Form>
                      <Row>
                        <h2 id='purchaseDetailsTotal'>Grand Total: ${this.state.purchaseTotal}</h2>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleEditDetails}>
                            Edit
                        </Button>
                        <Button onClick={this.handleUpdateOrder}>
                            Submit Changes
                        </Button>
                        <Button onClick={this.closeEditDetails} appearance="subtle">
                          Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* OPEN DETAILS MODAL */}
                <Modal 
                  size="md"
                  show={this.state.showDetails} 
                  onHide={this.closeDetails} 
                  id='openPurchasesDetailModal'
                >
                    <Modal.Header>
                        <Modal.Title>{this.state.soapName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form id='purchaseForm'>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="firstName">First Name</ControlLabel>
                            <FormControl 
                                disabled
                                name="firstName"
                                type="text"
                                className="form-control purchaseFormEntry"
                                id="firstName"
                                placeholder={this.state.firstName}                                    
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="lastName">Last Name</ControlLabel>
                            <FormControl 
                                disabled
                                name="lastName"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="lastName"
                                placeholder={this.state.lastName}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="phoneNumber">Phone #</ControlLabel>
                            <FormControl 
                                disabled
                                name="phoneNumber"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="phoneNumber"
                                placeholder={this.state.phoneNumber}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="email">Email</ControlLabel>
                            <FormControl 
                                disabled
                                name="email"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="email"
                                placeholder={this.state.email}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="purchaseDate">Purchase Date</ControlLabel>
                            <FormControl 
                                disabled
                                name="purchaseDate"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="purchaseDate"
                                placeholder={this.state.purchaseDate}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="purchaseId">Purchase ID</ControlLabel>
                            <FormControl 
                                disabled
                                name="purchaseId"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="purchaseId"
                                placeholder={this.state.purchaseId}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                            <ControlLabel className='purchaseFormLabel' htmlFor="confirmationNumber">Confirmation #</ControlLabel>
                            <FormControl 
                                disabled
                                name="confirmationNumber"
                                type="text"
                                // min={0}
                                className="form-control purchaseFormEntry"
                                id="confirmationNumber"
                                placeholder={this.state.confirmationNumber}                              
                            />
                        </FormGroup>
                        <FormGroup className="purchaseFormGroup">
                          <Table
                            className='purchaseDetailsTable'
                            // height={400}
                            data={this.state.purchaseDetails}
                            renderEmpty={() => <div id='emptyPurchasesTitle'>No Purchase Details</div>}
                            onRowClick={data => {
                                // console.log('PURCHASE TABLE DETAILS: ', data);
                            }}

                            >
                        
                            <Column width={200} resizable>
                                <HeaderCell>Product Name</HeaderCell>
                                <Cell dataKey="soapName" />
                                {/* <Cell>{(rowData, rowIndex) => {return rowData.productId.name}}</Cell> */}
                            </Column>

                            <Column width={70}>
                                <HeaderCell>Quanity</HeaderCell>
                                <Cell dataKey="soapQty" />
                            </Column>

                            <Column width={70}>
                                <HeaderCell>Price</HeaderCell>
                                <Cell>{(rowData) => {return "$" + rowData.soapPrice}}</Cell>
                                {/* <Cell dataKey="soapPrice" /> */}
                            </Column>

                            <Column width={70}>
                                <HeaderCell>Total</HeaderCell>
                                <Cell>{(rowData) => {return "$" + rowData.soapTotal}}</Cell>
                                {/* <Cell dataKey="total" /> */}
                            </Column>

                            {/* <Column width={100} resizable>
                                <HeaderCell>Order ID</HeaderCell>
                                <Cell dataKey="_id" />
                            </Column> */}

                            {/* <Column width={250} resizable>
                                <HeaderCell>Product ID</HeaderCell>
                                <Cell dataKey="soapId" />
                            </Column> */}

                          </Table>
                        </FormGroup>
                      </Form>
                      <Row>
                        <h2 id='purchaseDetailsTotal'>Grand Total: ${this.state.purchaseTotal}</h2>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeDetails} appearance="subtle">
                          Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* PURCHASES TABLE */}
                <Table
                    className='purchasesTable'
                    // height={400}
                    data={this.state.filteredPurchases}
                    renderEmpty={() => <div id='emptyPurchasesTitle'>No Matching Data</div>}
                    onRowClick={data => {
                        // console.log('PURCHASES TABLE: ', data);
                    }}

                    >
                    <Column width={100} align="center">
                        <HeaderCell>First Name</HeaderCell>
                        <Cell dataKey="firstName" />
                        
                    </Column>

                    <Column width={100}>
                        <HeaderCell>Last Name</HeaderCell>
                        <Cell dataKey="lastName" />
                    </Column>

                    <Column width={150}>
                        <HeaderCell>Phone #</HeaderCell>
                        <Cell dataKey="phoneNumber" />
                    </Column>

                    <Column width={150}>
                        <HeaderCell>Purchase Date</HeaderCell>
                        <Cell dataKey="purchaseDate" />
                    </Column>

                    <Column width={100}>
                        <HeaderCell>Confirmation #</HeaderCell>
                        <Cell dataKey="confirmationNumber" />
                    </Column>

                    {/* <Column width={200}>
                        <HeaderCell>Purchase Details</HeaderCell>
                        <Cell>
                        {rowData.purchaseDetails.map((purchase, i) => {
                            return <p>{purchase}</p>
                        })}
                            
                        </Cell>
                    </Column> */}


                    <Column id='actionColumn' width={120} fixed="right" align="center">
                        <HeaderCell id='actionColumnHeader'>Action</HeaderCell>
                        <Cell>
                        {rowData => {
                            // function handleAction() {
                            // alert(`id:${rowData.id}`);
                            // }
                            return (
                            <span>
                                <Button className='purchaseEditButtons' onClick={this.openEditDetails} data-product={rowData._id}> Edit </Button> |{' '}
                                <Button className='purchaseEditButtons' onClick={this.openDetails} data-product={rowData._id}> Details </Button>
                            </span>
                            );
                        }}
                        </Cell>
                    </Column>
                </Table>
            </div>
            <div id='placeOrderRow' className="row">
                {/* <h2 id='placeOrderTotal'>Grand Total: ${this.state.purchaseTotal}</h2> */}
                {/* <Button id='placeOrderButton'>
                    Secure Checkout <Icon icon='lock' />
                </Button> */}
            </div>   
            </span>
          </div>
        )
    }
}

export default Purchases