import React, { Component } from 'react';
import { Panel, Modal, Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button, Icon, Uploader } from 'rsuite';
import axios from 'axios';
import $ from 'jquery'
import NavbarAdmin from '../nav/NavbarAdmin.jsx'
import '../../css/admin/inventory.css'


class Inventory extends Component {
    constructor(props) {
        super(props);
      
        this.state = {
            node_env: "PRODUCTION",
            showEditModal: false,
            showAddModal: false,
            developmentURL: "http://localhost:3000/product",
            productionURL: "https://thursdaytherapy.herokuapp.com/product",
            soapName: '',
            soapId: '',
            soapFile: '',
            soapIngredients: '',
            soapPrice: '',
            soapImage: '',
            soapImageFile: '',
            soapEditName: '',
            soapEditIngredients: '',
            soapEditPrice: '',
            soapEditImage: '',
            soapEditImageFile: '',
            soapEditId: '',
            soapEditFile: '',
            searchEntry: '',
            error: '',
            qty: 'qty',
            products: [],
            filteredProducts: []
        }

        this.closeEditModal = this.closeEditModal.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.fetchData = this.fetchData.bind(this)
        this.addToInventory = this.addToInventory.bind(this)
        this.editInventory = this.editInventory.bind(this)
        this.submitEditInventory = this.submitEditInventory.bind(this)
        this.removeFromInventory = this.removeFromInventory.bind(this)
        this.changeQty = this.changeQty.bind(this)
        this.handleFileSelection = this.handleFileSelection.bind(this)
        this.handleEditInventory = this.handleEditInventory.bind(this)
        this.handleSearchEntry = this.handleSearchEntry.bind(this)
      
    }

    componentDidMount() {
        this.fetchData()
      }
  
    async fetchData() {
        const res = await fetch(this.state.node_env === "DEVELOPMENT" ? this.state.developmentURL : this.state.productionURL);
        res
          .json()
          .then((res) => {
            console.log('ALL PRODUCTS: ', res.data);
            console.log('ALL FILES: ', res.file);
            this.setState({
              products: res.data,
              filteredProducts: res.data
            });
          })
          .catch((error) => {
            this.setState({
              error: error
            });
          });
      }

    async addToInventory() {
      let soapName = document.getElementById('soapName').value
      let soapPrice = document.getElementById('soapPrice').value
      let soapIngredients = document.getElementById('soapIngredients').value
      let imageFile = this.state.soapImageFile

      // ADD FORM DATA
      const data = new FormData() 
      data.append('image', imageFile)
      data.append('name', soapName)
      data.append('price', soapPrice)
      data.append('ingredients', soapIngredients)
    
      // console.log('SOAP DETAILS: ', soapName, soapPrice, soapIngredients)
      // console.log('DATA: ', data)

      // ADD NEW SOAP PRODUCT
      axios.post(this.state.node_env === "DEVELOPMENT" ? this.state.developmentURL : this.state.productionURL, data, {
            headers: {'Content-Type': 'multipart/form-data' },
          })
          .then(res => { // then print response status
            console.log('INVENTORY NEW POST RESULT: ', res.statusText)
            this.closeAddModal()
          })
          .catch(err => {
            console.log('ERROR ADDING PRODUCT: ', err)
          })
      }

    async submitEditInventory() {
      let soapName = this.state.soapEditName
      let soapPrice = this.state.soapEditPrice
      let soapIngredients = this.state.soapEditIngredients
      let imageFile = this.state.soapImageFile
  
        // ADD FORM DATA
        const data = new FormData() 
        data.append('image', imageFile)
        data.append('name', soapName)
        data.append('price', soapPrice)
        data.append('ingredients', soapIngredients)
      
        // console.log('SOAP DETAILS: ', soapName, soapPrice, soapIngredients)
        // console.log('DATA: ', data)
  
        // REMOVE OLD PRODUCT
        let soapEditId = this.state.soapEditId
        console.log('DELETE THIS SOAP: ', soapEditId)
        
        try {
            const response = await fetch(this.state.node_env === "DEVELOPMENT" ? this.state.developmentURL : this.state.productionURL + "/" + soapEditId, {
              method: "DELETE",
            });
            let data = await response.json();
            // alert("Item Added To Cart");
            this.closeEditModal()
            console.log('DELETE RESPONSE: ', data);
          } catch (err) {
            alert("Something Went Wrong");
            console.log(err);
          }

        // ADD NEW SOAP PRODUCT
        axios.post(this.state.node_env = "DEVELOPMENT" ? this.state.developmentURL : this.state.productionURL, data, {
          headers: {'Content-Type': 'multipart/form-data' },
        })
        .then(res => { // then print response status
          console.log('INVENTORY NEW POST RESULT: ', res.statusText)
          this.closeAddModal()
        })
        .catch(err => {
          console.log('ERROR ADDING PRODUCT: ', err)
        })
        
        
      }

    async removeFromInventory() {
        // console.log(e.target)
        // let soap = e.target
        let soapId = this.state.soapId
        console.log('DELETE THIS SOAP: ', soapId)
        
        try {
            const response = await fetch(this.state.node_env === "DEVELOPMENT" ? this.state.developmentURL : this.state.productionURL + '/' + soapId, {
              method: "DELETE",
            });
            let data = await response.json();
            // alert("Item Added To Cart");
            this.closeEditModal()
            console.log('DELETE RESPONSE: ', data);
          } catch (err) {
            alert("Something Went Wrong");
            console.log(err);
          }
      }

    handleFileSelection = (e) => {
          // e.preventDefault()
          console.log('HANDLING FILE SELECTION')
          let file = e[0].blobFile
          console.log('FILENAME: ', file)
          // let image = document.getElementById('image')
          // console.log('IMAGE TO UPLOAD: ', e.target.files[0])
          // let imageFile = e.target.files[0]
          this.setState({
            soapImageFile: file
          })
      }
  
    closeEditModal() {
        this.fetchData()
        this.setState({ 
          showEditModal: false,
          qty: 'qty',
         });
      }
  
    openEditModal = (e) => {
        // console.log(e.target)
        let soap = e.target
        let soapName = soap.dataset.soapname
        let soapId = soap.dataset.soapid
        let soapIngredients = soap.dataset.soapingredients
        let soapImage = soap.dataset.soapimage
        let soapPrice = soap.dataset.soapprice
        let soapFile = soap.dataset.soapfile
        console.log("PRODUCT: ", soapName)
        this.setState({ 
            soapEditImage: soapImage,
            soapEditId: soapId,
            soapEditName: soapName,
            soapEditPrice: soapPrice,
            soapEditIngredients: soapIngredients,
            soapEditFile: soapFile,
            showEditModal: true
        });
      }
    
    closeAddModal() {
        this.fetchData()
        this.setState({ 
            showAddModal: false,
            qty: 'qty',
          });
      }

    openAddModal = (e) => {
        console.log(e.target)
        let soap = e.target
        let soapName = soap.dataset.soapname
        let soapId = soap.dataset.soapid
        let soapImage = soap.dataset.soapimage
        let soapPrice = soap.dataset.soapprice
        let soapFile = soap.dataset.soapfile
        console.log("PRODUCT: ", soapName)
        this.setState({ 
            soapImage: soapImage,
            soapId: soapId,
            soapName: soapName,
            soapPrice: soapPrice,
            soapFile: soapFile,
            showAddModal: true
        });
      }

    changeQty = (e) => {
      console.log("Quantity change: ", e.target)
      let newQty = $(e.target).text()
      console.log('New qty: ', newQty)
      this.setState({
        qty: newQty
      })
      }

    editInventory = () => {
      document.getElementById('soapEditName').disabled = false
      document.getElementById('soapEditPrice').disabled = false
      document.getElementById('soapEditIngredients').disabled = false
      }

    handleEditInventory = event => {
        console.log(event)
        console.log('NEW SOAP NAME: ', event.soapEditName)
        console.log('NEW SOAP PRICE: ', event.soapEditPrice)
        console.log('NEW SOAP INGREDIENTS: ', event.soapEditIngredients)
        this.setState({
            soapEditName: event.soapEditName !== undefined ? event.soapEditName : this.state.soapEditName,
            soapEditPrice: event.soapEditPrice !== undefined ? event.soapEditPrice : this.state.soapEditPrice,
            soapEditIngredients: event.soapEditIngredients !== undefined ? event.soapEditIngredients : this.state.soapEditIngredients
        })
      }

    handleSearchEntry = event => {
        console.log(event)
        console.log('NEW SEARCH ENTRY: ', event.searchEntry)
        let products = this.state.products
        let newSearchEntry = event.searchEntry
        if(newSearchEntry === '') {
          this.fetchData()
        }
        let inventoryFiltered = products.filter(product => {
          return product.name.toLowerCase().includes(newSearchEntry.toLowerCase())
        })
        this.setState({
          filteredProducts: inventoryFiltered
        })
      }

    

    render() {                                                       
        return (
          <div id='inventory'>
            <NavbarAdmin />
              <span>
                <div className="row inventoryTitleRow">
                  <p className='inventoryTitle'>Inventory</p>
                  {/* SEARCH BAR */}
                  <Form id='adminInventorySearchBarForm' onChange={(event) => this.handleSearchEntry(event)}>
                    <FormGroup id='adminInventorySearchBarFormGroup'>
                      <FormControl 
                        name="searchEntry"
                        type="text"
                        className="form-control inventorySearchBarFromEntry"
                        id="searchEntry"
                        placeholder="Search by name" 
                      />
                      <Icon className='searchIcon' icon='search' size="lg" />
                    </FormGroup>
                  </Form>
                </div>
                
                <div id='productsImagesRow1' className="row">
                  {/* ADD INVENTORY MODAL */}
                  <Modal show={this.state.showAddModal} onHide={this.closeAddModal}>
                    <Modal.Header>
                      <Modal.Title>{this.state.soapName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form id='addInventoryForm' encType="multipart/form-data" action='/products' method='POST'>
                        <FormGroup className="adminAddFormGroup">
                          <ControlLabel 
                            className='inventoryFormLabel' 
                            htmlFor="name"
                          >
                            Soap Name
                          </ControlLabel>
                          <FormControl 
                              name="soapName"
                              type="text"
                              className="form-control inventoryFormEntry"
                              id="soapName"
                              placeholder='Soap Name'                                    
                          />
                          {/* <small id="usernameError" className="form-text text-muted">{this.state.nameTaken}</small> */}
                        </FormGroup>
                        <FormGroup className="adminAddFormGroup">
                          <ControlLabel 
                            className='inventoryFormLabel' 
                            htmlFor="price"
                          >
                            Price
                          </ControlLabel>
                          <FormControl 
                              name="soapPrice"
                              type="text"
                              // min={0}
                              className="form-control inventoryFormEntry"
                              id="soapPrice"
                              placeholder='Price'                             
                          />
                        </FormGroup>
                        <FormGroup className="adminAddFormGroup">
                          <ControlLabel 
                            id='ingredientsLabel' 
                            className='inventoryFormLabel' 
                            htmlFor="ingredients"
                          >
                            Soap Ingredients
                          </ControlLabel>
                          <FormControl 
                            id='soapIngredients' 
                            rows={5} 
                            name="soapIngredients" 
                            componentClass="textarea" 
                            placeholder='Ingredients...' 
                          />
                        </FormGroup>
                        <FormGroup className="adminAddFormGroup">
                          <ControlLabel 
                            className='inventoryFormLabel' 
                            htmlFor="image"
                          >
                            Soap Image
                          </ControlLabel>
                          {/* <input type='file' id='image' name='image' onChange={this.handleFileSelection} /> */}
                          <Uploader multiple={false} autoUpload={false} listType="picture" id="image" name="image" onChange={(fileList) => this.handleFileSelection(fileList)}>
                            <button>
                              <Icon icon='camera-retro' size="lg" />
                            </button>
                          </Uploader>
                          {/* <HelpBlock>Required</HelpBlock> */}
                          {/* <FormControl 
                            onChange={this.handleFileSelection}
                            id='soapImage' 
                            type='file' 
                            name="file"
                            className="form-control inventoryFormEntry" 
                          /> */}
                          {/* <HelpBlock>{this.state.soapFile}</HelpBlock> */}
                        </FormGroup>
                      </Form>
                      {/* <img src={"http://localhost:3000/" + this.state.soapImage} data-soapname='Peacock Z' onClick={this.openEditModal} className="productsImageModal" alt="peacockZ1" /> */}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={this.addToInventory}>
                        Add to Inventory
                      </Button>
                      <Button onClick={this.closeAddModal}>
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  {/* EDIT INVENTORY MODAL */}
                  <Modal show={this.state.showEditModal} onHide={this.closeEditModal}>
                    <Modal.Header>
                      <Modal.Title>{this.state.soapName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form id='inventoryForm' onChange={(event) => this.handleEditInventory(event)} >
                        <FormGroup className="adminAddFormGroup">
                          <ControlLabel className='inventoryFormLabel' htmlFor="name">Soap Name</ControlLabel>
                          <FormControl 
                              disabled
                              name="soapEditName"
                              type="text"
                              className="form-control inventoryFormEntry"
                              id="soapEditName"
                              value={this.state.soapEditName}                            
                          />
                          <small id="usernameError" className="form-text text-muted">{this.state.nameTaken}</small>
                        </FormGroup>
                        <FormGroup className="adminAddFormGroup">
                          <ControlLabel 
                            className='inventoryFormLabel' 
                            htmlFor="price"
                          >
                            Price
                          </ControlLabel>
                          <FormControl 
                            disabled
                            name="soapEditPrice"
                            type="text"
                            // min={0}
                            className="form-control inventoryFormEntry"
                            id="soapEditPrice"
                            value={this.state.soapEditPrice}
                            // onChange={this.handleEditInventory}                              
                          />
                        </FormGroup>
                        <FormGroup className="adminAddFormGroup">
                          <ControlLabel 
                            id='ingredientsLabel' 
                            className='inventoryFormLabel' 
                            htmlFor="ingredients"
                          >
                            Soap Ingredients
                          </ControlLabel>
                          {/* <HelpBlock>Required</HelpBlock> */}
                          <FormControl 
                            disabled
                            id='soapEditIngredients' 
                            rows={5} 
                            name="soapEditIngredients" 
                            componentClass="textarea"
                            value={this.state.soapEditIngredients}
                            // onChange={this.handleEditInventory}
                          />
                        </FormGroup>
                        <FormGroup className="adminAddFormGroup">
                          <ControlLabel 
                            className='inventoryFormLabel' 
                            htmlFor="img"
                          >
                            Soap Image
                          </ControlLabel>
                          {/* <HelpBlock>Required</HelpBlock> */}
                          {/* <FormControl 
                            id='img' 
                            type='file' 
                            name="file"
                            className="form-control inventoryFormEntry" 
                          /> */}
                          <Uploader multiple={false} autoUpload={false} listType="picture" id="image" name="image" onChange={(fileList) => this.handleFileSelection(fileList)}>
                            <button>
                              <Icon icon='camera-retro' size="lg" />
                            </button>
                          </Uploader>
                          <HelpBlock id='editImageHelpBlock'>{this.state.soapEditFile}</HelpBlock>
                        </FormGroup>
                      </Form>
                      {/* <img src={"http://localhost:3000/" + this.state.soapImage} data-soapname='Peacock Z' onClick={this.openEditModal} className="productsImageModal" alt="peacockZ1" /> */}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={this.editInventory}>
                        Edit
                      </Button>
                      <Button onClick={(e) => this.submitEditInventory(this.state.soapId)}>
                        Submit Changes
                      </Button>
                      <Button onClick={this.removeFromInventory}>
                        Delete from Inventory
                      </Button>
                      <Button onClick={this.closeEditModal}>
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  {/* ADD INVENTORY PANEL */}
                  <Panel className='addProductPanel productsImagePanel' shaded bordered bodyFill={true} style={{ display: 'inline-block' }}>
                    <Icon icon='plus-square' onClick={this.openAddModal} id="addProductImage" />
                      <Panel className='productsImageHeader' header="Add a Product"></Panel>
                  </Panel>

                  {/* MAP THRU INVENTORY & CREATE PANELS */}
                  {this.state.filteredProducts.map((product, i) => (
                    <span key={product._id}>
                      <Panel className='productsImagePanel' shaded bordered bodyFill={true} style={{ display: 'inline-block' }}>
                          <img 
                            src={(this.state.node_env === "DEVELOPMENT" ? this.state.developmentURL : this.state.productionURL) + product.image} 
                            data-soapname={product.name} 
                            data-soapprice={product.price} 
                            data-soapimage={product.image} 
                            data-soapid={product._id} 
                            data-soapfile={product.image}
                            data-soapingredients={product.ingredients ? product.ingredients : 'No ingredients listed.'}
                            onClick={this.openEditModal} 
                            className="productsImage" 
                            alt="soap name" 
                          />
                          <Panel className='productsImageHeader' header={product.name}></Panel>
                      </Panel>
                    </span>   
                  ))}
              </div>
            </span>
          </div>
        )
    }
}

export default Inventory