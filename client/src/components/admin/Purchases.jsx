import React, { Component } from 'react';
import { Modal, Form, FormGroup, ControlLabel, FormControl, Button, Table } from 'rsuite';
import API from '../../utils/API'
import NavbarAdmin from '../nav/NavbarAdmin.jsx'
import moment from 'moment'
import '../../css/admin/purchases.css'


class Purchases extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPurchases: [],
            showDetails: false,
            showEditPurchase: false,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            purchaseDate: '',
            confirmationNumber: '',
            purchaseId: '',
            purchaseDetails: [],
            purchaseTotal: ''

        }

        this.getPurchases = this.getPurchases.bind(this)
        this.openDetails = this.openDetails.bind(this)
        this.closeDetails = this.closeDetails.bind(this)
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
                currentPurchases: purchases
            })
        })
        .catch(err => {
            console.log('ERROR GETTING PURCHASES: ', err)
        })
      }

    closeDetails() {
        this.getPurchases()
        this.setState({ showDetails: false });
      }


    openDetails = (e) => {
        let targetPurchase = e.target
        let purchases = this.state.currentPurchases
        console.log('CURRENT PURCHASES: ', purchases)
        let purchaseId = targetPurchase.dataset.product
        let purchase = purchases.filter(purchase => {
            return purchase._id === purchaseId
        })
        let purchaseDetails = purchase[0].purchaseDetails
        let purchaseTotal = 0
        for (let i=0; i<purchaseDetails.length; i++) {
            let purchaseItem = purchaseDetails[i]
            let purchaseItemTotal = purchaseItem.total
            purchaseTotal = purchaseTotal + purchaseItemTotal
        }
        // let soapProductId = soap[0].productId._id
        // let soapName = soap[0].productId.name
        console.log('PURCHASE SELECTED: ', purchase)
        console.log('PURCHASE DETAILS: ', purchaseDetails)
        console.log('PURCHASE TOTAL: ', purchaseTotal)
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

    render() {            
        const { Column, HeaderCell, Cell } = Table;                                                                                             
        return (
          <div id='purchases'>
            <NavbarAdmin />
              <span>
                <h2 className='purchasesTitle'>Recent Purchases</h2>
                <div id='purchaseRow' className="row">
                

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
                                console.log('PURCHASE TABLE DETAILS: ', data);
                            }}

                            >
                        
                            <Column width={200} resizable>
                                <HeaderCell>Product Name</HeaderCell>
                                <Cell>{(rowData, rowIndex) => {return rowData.productId.name}}</Cell>
                            </Column>

                            <Column width={70}>
                                <HeaderCell>Quanity</HeaderCell>
                                <Cell dataKey="quantity" />
                            </Column>

                            <Column width={70}>
                                <HeaderCell>Price</HeaderCell>
                                <Cell dataKey="price" />
                            </Column>

                            <Column width={70}>
                                <HeaderCell>Total</HeaderCell>
                                <Cell dataKey="total" />
                            </Column>

                            <Column width={100} resizable>
                                <HeaderCell>Order ID</HeaderCell>
                                <Cell dataKey="_id" />
                            </Column>

                            <Column width={100} resizable>
                                <HeaderCell>Product ID</HeaderCell>
                                <Cell>{(rowData, rowIndex) => {return rowData.productId._id}}</Cell>
                            </Column>

                          </Table>
                        </FormGroup>
                      </Form>
                      <row>
                        <h2 id='purchaseDetailsTotal'>Grand Total: ${this.state.purchaseTotal}</h2>
                      </row>
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
                    data={this.state.currentPurchases}
                    renderEmpty={() => <div id='emptyPurchasesTitle'>No Purchases Yet</div>}
                    onRowClick={data => {
                        console.log('PURCHASES TABLE: ', data);
                    }}

                    >
                    <Column width={100} align="center" fixed>
                        <HeaderCell>First Name</HeaderCell>
                        <Cell dataKey="firstName" />
                        
                    </Column>

                    <Column width={100} fixed>
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
                                <Button className='purchaseEditButtons' onClick={this.open} data-product={rowData._id}> Edit </Button> |{' '}
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