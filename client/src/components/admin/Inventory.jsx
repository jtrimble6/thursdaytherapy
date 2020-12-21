import React, { Component } from 'react';
import { Panel, Modal, Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button, Icon, Alert } from 'rsuite';
import axios from 'axios';
import API from '../../utils/API'
import $ from 'jquery'
import NavbarAdmin from '../nav/NavbarAdmin.jsx'
import '../../css/admin/inventory.css'


class Inventory extends Component {
    constructor(props) {
        super(props);
      
        this.state = {
            showEditModal: false,
            showAddModal: false,
            developmentURL: "http://localhost:3000/product/",
            developmentImageURL: "http://localhost:3000/uploads/",
            developmentPostImageURL: "http://localhost:3000/upload/",
            productionURL: "https://thursdaytherapy.herokuapp.com/product/",
            productionImageURL: "https://thursdaytherapy.herokuapp.com/",
            productionPostImageURL: "https://thursdaytherapy.herokuapp.com/upload/",
            soapName: '',
            soapId: '',
            soapFile: '',
            soapIngredients: '',
            soapPrice: '',
            soapImage: '',
            soapImageFile: '',
            soapImageId: '',
            soapEditName: '',
            soapEditIngredients: '',
            soapEditPrice: '',
            soapEditImage: '',
            soapEditImageFile: '',
            soapEditId: '',
            soapEditFile: '',
            searchEntry: '',
            productImages: [],
            error: '',
            qty: 'qty',
            products: [],
            filteredProducts: []
        }
        this.closeAddModal = this.closeAddModal.bind(this)
        this.openAddModal = this.openAddModal.bind(this)
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
      let productImages = []
      const res = await fetch(process.env.NODE_ENV === "development" ? "http://localhost:3000/uploads" : "https://thursdaytherapy.herokuapp.com/uploads");
        res.json()
          .then((res) => {
            // console.log('ALL IMAGES: ', res);
            productImages = res
            // console.log('ALL IMAGES: ', res.data);
            // console.log('ALL FILES: ', res.file);
            this.setState({
              productImages: res,
              // filteredProducts: res.data
            });
            API.getProducts()
                .then(res => {
                  // console.log('PRODUCT IMAGES RETRIEVED: ', productImages)
                  let productsData = res.data
                  // console.log('PRODUCTS: ', productsData)
                  for (let p=0; p<productsData.length; p++) {
                    let product = productsData[p]
                    let productName = product.name
                    let productImage = productImages.filter(image => {
                      return image.productId === productName
                    })
                    let newProducts = [...productsData]
                    // console.log('FILENAME: ', productImage[0])
                    let productImageFile = productImage[0]
                    if (productImageFile) {
                      let newProduct = {
                        ...newProducts[p], 
                        soapImageFile: productImage[0].filename,
                        soapImageId: productImage[0]._id
                      }
                      newProducts[p] = newProduct
                      this.setState({
                        products: newProducts,
                        filteredProducts: newProducts
                      })
                      productsData = newProducts
                    }
                    
                    // console.log('NEW PRODUCTS WITH IMAGES: ', this.state.filteredProducts)
                  }
                  // this.setState({
                  //     products: res.data,
                  //     filteredProducts: res.data
                  //   });
                })
                .catch(err => {
                  Alert.error('There was an error getting products, please reload page.', 5000)
                  console.log('ERROR GETTING PRODUCTS: ', err)
                })
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

      if (soapName === '') {
        Alert.error('Please enter a soap name.', 5000)
        return;
      }
      if (soapPrice === '') {
        Alert.error('Please enter a soap price.', 5000)
        return;
      }
      if (soapIngredients === '') {
        Alert.error('Please enter a soap ingredients.', 5000)
        return;
      }
      if (imageFile === '') {
        Alert.error('Please add an image.', 5000)
        return;
      }

      // console.log('IMAGE FILE: ', imageFile)

      let data = {
        'name': soapName,
        'price': soapPrice,
        'ingredients': soapIngredients,
        'image': imageFile.name
      }

      let formData = new FormData();
      let imagefile = document.querySelector('#fileAdd');
      formData.append("file", imagefile.files[0]);
     
      // console.log('DATA TO UPLOAD: ', data)

      // ADD NEW SOAP PRODUCT
      API.saveProduct(data)
          .then(res => {
            console.log('SAVE PRODUCT RESULT: ', res)
            axios.post(process.env.NODE_ENV === "development" ? "http://localhost:3000/upload/" : "https://thursdaytherapy.herokuapp.com/upload/" + soapName, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            Alert.success('New product successfully added!', 5000)
            this.fetchData()
            this.closeAddModal()
          })
          .catch(err => {
            Alert.error('There was an error adding product, please try again.', 5000)
            console.log('ERROR SAVING PRODUCT: ', err)
          })
        
      }

    async submitEditInventory() {
      let soapName = this.state.soapEditName
      let soapPrice = this.state.soapEditPrice
      let soapIngredients = this.state.soapEditIngredients
      let imageFile = this.state.soapEditImage
      let soapId = this.state.soapEditId
      let soapImageId = this.state.soapImageId
      let data = {
        'name': soapName,
        'price': soapPrice,
        'ingredients': soapIngredients,
        'image': imageFile
      }

      let formData = new FormData();
      let imageFileUpdate = document.querySelector('#fileUpdate');
      formData.append("file", imageFileUpdate.files[0]);

      if (imageFileUpdate.files[0]) {
        API.updateProduct(soapId, data)
          .then(res => {
            // console.log('UPDATE PRODUCT RESULT: ', res)
            // this.closeEditModal()
              axios.delete(process.env.NODE_ENV === "development" ? "http://localhost:3000/uploads/" : "https://thursdaytherapy.herokuapp.com/uploads/" + soapImageId, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                })
              axios.post(process.env.NODE_ENV === "development" ? "http://localhost:3000/upload/" : "https://thursdaytherapy.herokuapp.com/upload/" + soapName, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                })
              Alert.success('Product successfully updated!', 5000)
              this.fetchData()
              this.closeEditModal()
            })
          .catch(err => {
              Alert.error('There was an error updating the product. Please try again.', 10000)
              console.log('ERROR UPDATING PRODUCT: ', err)
            })
      } else {
        let soapImages = this.state.productImages
        let oldImageFile = soapImages.filter(soap => {
          return soap.productId = this.state.soapName
        })
        let soapFileId = oldImageFile.filename
        let newSoapData = {
          soapName: soapName
        }
        API.updateProduct(soapId, data)
          .then(res => {
            // console.log('UPDATE PRODUCT RESULT: ', res)
            // this.closeEditModal()
              axios.put(process.env.NODE_ENV === "development" ? "http://localhost:3000/uploads/" : "https://thursdaytherapy.herokuapp.com/uploads/" + soapFileId, newSoapData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  },
                })
              Alert.success('Product successfully updated!', 5000)
              this.fetchData()
              this.closeEditModal()
            })
          .catch(err => {
              Alert.error('There was an error updating the product. Please try again.', 10000)
              console.log('ERROR UPDATING PRODUCT: ', err)
            })
      }
      
      // console.log('SOAP UPDATE ID: ', soapId)
      // console.log('SOAP UPDATE DATA: ', data)
      // console.log('SOAP UPDATE IMAGE ID: ', soapImageId)

      
          
      }

    async removeFromInventory() {
        // console.log(e.target)
        // let soap = e.target
        let soapId = this.state.soapEditId
        // console.log('DELETE THIS SOAP: ', soapId)

        API.removeProduct(soapId)
          .then(res => {
              // console.log('REMOVE PRODUCT RESULT: ', res)
              Alert.success('Product was successfully removed.', 5000)
              this.closeEditModal()
              this.fetchData()
          })
          .catch(err => {
            console.log('ERROR REMOVING PRODUCT: ', err)
          })
        
      }

    handleFileSelection = (e) => {
          // e.preventDefault()
          // console.log('HANDLING FILE SELECTION')
          // let file = e[0].blobFile
          // console.log('FILENAME: ', file)
          // let image = document.getElementById('soapImage')
          // console.log('IMAGE TO UPLOAD: ', image)
          let imageFile = e.target.files[0]
          // console.log('IMAGE FILE: ', imageFile)
          this.setState({
            soapImageFile: imageFile
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
        let soapImageId = soap.dataset.soapimageid
        // console.log("PRODUCT: ", soap)
        this.setState({ 
            soapEditImage: soapImage,
            soapEditId: soapId,
            soapEditName: soapName,
            soapEditPrice: soapPrice,
            soapEditIngredients: soapIngredients,
            soapEditFile: soapFile,
            soapImageId: soapImageId,
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
        // console.log(e.target)
        let soap = e.target
        let soapName = soap.dataset.soapname
        let soapId = soap.dataset.soapid
        let soapImage = soap.dataset.soapimage
        let soapPrice = soap.dataset.soapprice
        let soapFile = soap.dataset.soapfile
        // console.log("PRODUCT: ", soapName)
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
      // console.log("Quantity change: ", e.target)
      let newQty = $(e.target).text()
      // console.log('New qty: ', newQty)
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
        // console.log(event)
        // console.log('NEW SOAP NAME: ', event.soapEditName)
        // console.log('NEW SOAP PRICE: ', event.soapEditPrice)
        // console.log('NEW SOAP INGREDIENTS: ', event.soapEditIngredients)
        this.setState({
            soapEditName: event.soapEditName !== undefined ? event.soapEditName : this.state.soapEditName,
            soapEditPrice: event.soapEditPrice !== undefined ? event.soapEditPrice : this.state.soapEditPrice,
            soapEditIngredients: event.soapEditIngredients !== undefined ? event.soapEditIngredients : this.state.soapEditIngredients
        })
      }

    handleSearchEntry = event => {
        // console.log(event)
        // console.log('NEW SEARCH ENTRY: ', event.searchEntry)
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
                            htmlFor="file"
                          >
                            Soap Image
                          </ControlLabel>
                          <input type='file' id='fileAdd' name='file' onChange={this.handleFileSelection} />
                          {/* <Uploader multiple={false} autoUpload={false} listType="picture" id="image" name="image" onChange={(fileList) => this.handleFileSelection(fileList)}>
                            <button>
                              <Icon icon='camera-retro' size="lg" />
                            </button>
                          </Uploader> */}
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
                          {/* <Uploader multiple={false} autoUpload={false} listType="picture" id="image" name="image" onChange={(fileList) => this.handleFileSelection(fileList)}>
                            <button>
                              <Icon icon='camera-retro' size="lg" />
                            </button>
                          </Uploader> */}
                          <input type='file' id='fileUpdate' name='file' onChange={this.handleFileSelection} />
                          <HelpBlock id='editImageHelpBlock'>{this.state.soapEditFile}</HelpBlock>
                        </FormGroup>
                      </Form>
                      {/* <img src={"http://localhost:3000/" + this.state.soapImage} data-soapname='Peacock Z' onClick={this.openEditModal} className="productsImageModal" alt="peacockZ1" /> */}
                    </Modal.Body>
                    <Modal.Footer id='adminEditInventoryModalFooter'>
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
                            // src={(process.env.NODE_ENV === "development" ? this.state.developmentImageURL : this.state.productionImageURL) + product.soapImageFile ? product.soapImageFile : product.image} 
                            src={`uploads/${product.soapImageFile}`}
                            data-soapname={product.name} 
                            data-soapprice={product.price} 
                            data-soapimage={product.soapImageFile} 
                            data-soapid={product._id} 
                            data-soapfile={product.image}
                            data-soapimageid={product.soapImageId}
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