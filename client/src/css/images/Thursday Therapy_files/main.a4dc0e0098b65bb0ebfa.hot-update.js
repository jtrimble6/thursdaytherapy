webpackHotUpdate("main",{

/***/ "./src/components/admin/Inventory.jsx":
/*!********************************************!*\
  !*** ./src/components/admin/Inventory.jsx ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__react_refresh_utils__, __react_refresh_error_overlay__) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var rsuite__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rsuite */ "./node_modules/rsuite/es/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_API__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/API */ "./src/utils/API.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _nav_NavbarAdmin_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../nav/NavbarAdmin.jsx */ "./src/components/nav/NavbarAdmin.jsx");
/* harmony import */ var _css_admin_inventory_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../css/admin/inventory.css */ "./src/css/admin/inventory.css");
/* harmony import */ var _css_admin_inventory_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_css_admin_inventory_css__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__);
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! react-refresh/runtime */ "./node_modules/react-refresh/runtime.js");
__webpack_require__.$Refresh$.setup(module.i);

var _jsxFileName = "/Users/j.trimble/Desktop/Coding/thursdaytherapy/client/src/components/admin/Inventory.jsx";










class Inventory extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);

    this.setRedirect = () => {
      this.setState({
        redirect: true
      });
    };

    this.renderRedirect = () => {
      if (this.state.redirect === true) {
        return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Redirect"], {
          to: "/login"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 85,
          columnNumber: 18
        }, this);
      } else {}
    };

    this.handleFileSelection = e => {
      // e.preventDefault()
      // console.log('HANDLING FILE SELECTION')
      // let file = e[0].blobFile
      // console.log('FILENAME: ', file)
      // let image = document.getElementById('soapImage')
      // console.log('IMAGE TO UPLOAD: ', image)
      let imageFile = e.target.files[0]; // console.log('IMAGE FILE: ', imageFile)

      this.setState({
        soapImageFile: imageFile
      });
    };

    this.openEditModal = e => {
      // console.log(e.target)
      let soap = e.target;
      let soapName = soap.dataset.soapname;
      let soapId = soap.dataset.soapid;
      let soapIngredients = soap.dataset.soapingredients;
      let soapImage = soap.dataset.soapimage;
      let soapPrice = soap.dataset.soapprice;
      let soapFile = soap.dataset.soapfile;
      let soapImageId = soap.dataset.soapimageid;
      console.log("PRODUCT: ", soapName);
      this.setState({
        soapEditImage: soapImage,
        soapEditId: soapId,
        soapOriginalName: soapName,
        soapEditName: soapName,
        soapEditPrice: soapPrice,
        soapEditIngredients: soapIngredients,
        soapEditFile: soapFile,
        soapImageId: soapImageId,
        showEditModal: true
      });
    };

    this.openAddModal = e => {
      // console.log(e.target)
      let soap = e.target;
      let soapName = soap.dataset.soapname;
      let soapId = soap.dataset.soapid;
      let soapImage = soap.dataset.soapimage;
      let soapPrice = soap.dataset.soapprice;
      let soapFile = soap.dataset.soapfile; // console.log("PRODUCT: ", soapName)

      this.setState({
        soapImage: soapImage,
        soapId: soapId,
        soapName: soapName,
        soapPrice: soapPrice,
        soapFile: soapFile,
        showAddModal: true
      });
    };

    this.changeQty = e => {
      // console.log("Quantity change: ", e.target)
      let newQty = jquery__WEBPACK_IMPORTED_MODULE_5___default()(e.target).text(); // console.log('New qty: ', newQty)

      this.setState({
        qty: newQty
      });
    };

    this.editInventory = () => {
      document.getElementById('soapEditName').disabled = false;
      document.getElementById('soapEditPrice').disabled = false;
      document.getElementById('soapEditIngredients').disabled = false;
    };

    this.handleEditInventory = event => {
      // console.log(event)
      // console.log('NEW SOAP NAME: ', event.soapEditName)
      // console.log('NEW SOAP PRICE: ', event.soapEditPrice)
      // console.log('NEW SOAP INGREDIENTS: ', event.soapEditIngredients)
      this.setState({
        soapEditName: event.soapEditName !== undefined ? event.soapEditName : this.state.soapEditName,
        soapEditPrice: event.soapEditPrice !== undefined ? event.soapEditPrice : this.state.soapEditPrice,
        soapEditIngredients: event.soapEditIngredients !== undefined ? event.soapEditIngredients : this.state.soapEditIngredients
      });
    };

    this.handleSearchEntry = event => {
      // console.log(event)
      // console.log('NEW SEARCH ENTRY: ', event.searchEntry)
      let products = this.state.products;
      let newSearchEntry = event.searchEntry;

      if (newSearchEntry === '') {
        this.fetchData();
      }

      let inventoryFiltered = products.filter(product => {
        return product.name.toLowerCase().includes(newSearchEntry.toLowerCase());
      });
      this.setState({
        filteredProducts: inventoryFiltered
      });
    };

    this.state = {
      redirect: false,
      showEditModal: false,
      showAddModal: false,
      developmentURL: "http://localhost:3000/product/",
      developmentImageURL: "http://localhost:3000/uploads/",
      developmentPostImageURL: "http://localhost:3000/upload/",
      productionURL: "https://thursday-therapy.com/product/",
      productionImageURL: "https://thursday-therapy.com/",
      productionPostImageURL: "https://thursday-therapy.com/upload/",
      soapOriginalName: '',
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
    };
    this.setRedirect = this.setRedirect.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
    this.closeAddModal = this.closeAddModal.bind(this);
    this.openAddModal = this.openAddModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.addToInventory = this.addToInventory.bind(this);
    this.editInventory = this.editInventory.bind(this);
    this.submitEditInventory = this.submitEditInventory.bind(this);
    this.removeFromInventory = this.removeFromInventory.bind(this);
    this.changeQty = this.changeQty.bind(this);
    this.handleFileSelection = this.handleFileSelection.bind(this);
    this.handleEditInventory = this.handleEditInventory.bind(this);
    this.handleSearchEntry = this.handleSearchEntry.bind(this);
  }

  componentDidMount() {
    let localSessionID = localStorage.getItem('sessionID');
    console.log('CHECKING SESSION ID:');
    console.log(localSessionID);

    if (!localSessionID || localSessionID === null) {
      this.setRedirect();
    } else {
      this.fetchData();
    }
  }

  async fetchData() {
    let productImages = [];
    const res = await fetch( true ? "http://localhost:3000/uploads" : undefined);
    res.json().then(res => {
      // console.log('ALL IMAGES: ', res);
      productImages = res; // console.log('ALL IMAGES: ', res.data);
      // console.log('ALL FILES: ', res.file);

      this.setState({
        productImages: res // filteredProducts: res.data

      });
      _utils_API__WEBPACK_IMPORTED_MODULE_4__["default"].getProducts().then(res => {
        console.log('PRODUCT IMAGES RETRIEVED: ', productImages);
        let productsData = res.data;
        console.log('PRODUCTS: ', productsData);

        for (let p = 0; p < productsData.length; p++) {
          let product = productsData[p];
          let productName = product.name;
          let productImage = productImages.filter(image => {
            return image.productId === productName;
          });
          let newProducts = [...productsData]; // console.log('FILENAME: ', productImage[0])

          let productImageFile = productImage[0];

          if (productImageFile) {
            let newProduct = { ...newProducts[p],
              soapImageFile: productImage[0].filename,
              soapImageId: productImage[0]._id
            };
            newProducts[p] = newProduct;
            this.setState({
              products: newProducts,
              filteredProducts: newProducts
            });
            productsData = newProducts;
          } // console.log('NEW PRODUCTS WITH IMAGES: ', this.state.filteredProducts)

        } // this.setState({
        //     products: res.data,
        //     filteredProducts: res.data
        //   });

      }).catch(err => {
        rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].error('There was an error getting products, please reload page.', 5000);
        console.log('ERROR GETTING PRODUCTS: ', err);
      });
    }).catch(error => {
      this.setState({
        error: error
      });
    });
  }

  async addToInventory() {
    let soapName = document.getElementById('soapName').value;
    let soapPrice = document.getElementById('soapPrice').value;
    let soapIngredients = document.getElementById('soapIngredients').value;
    let imageFile = this.state.soapImageFile;

    if (soapName === '') {
      rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].error('Please enter a soap name.', 5000);
      return;
    }

    if (soapPrice === '') {
      rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].error('Please enter a soap price.', 5000);
      return;
    }

    if (soapIngredients === '') {
      rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].error('Please enter a soap ingredients.', 5000);
      return;
    }

    if (imageFile === '') {
      rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].error('Please add an image.', 5000);
      return;
    } // console.log('IMAGE FILE: ', imageFile)


    let data = {
      'name': soapName,
      'price': soapPrice,
      'ingredients': soapIngredients,
      'image': imageFile.name
    };
    let formData = new FormData();
    let imagefile = document.querySelector('#fileAdd');
    formData.append("file", imagefile.files[0]);
    console.log('DATA TO UPLOAD: ', data); // ADD NEW SOAP PRODUCT

    _utils_API__WEBPACK_IMPORTED_MODULE_4__["default"].saveProduct(data).then(res => {
      console.log('SAVE PRODUCT RESULT: ', res);
      axios__WEBPACK_IMPORTED_MODULE_3___default.a.post( true ? "http://localhost:3000/upload/" : undefined, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].success('New product successfully added!', 5000); // this.fetchData()

      this.closeAddModal(); // window.location.reload()
    }).catch(err => {
      rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].error('There was an error adding product, please try again.', 5000);
      console.log('ERROR SAVING PRODUCT: ', err);
    });
  }

  async submitEditInventory() {
    let soapName = this.state.soapEditName;
    let soapPrice = this.state.soapEditPrice;
    let soapIngredients = this.state.soapEditIngredients;
    let imageFile = this.state.soapEditImage;
    let soapId = this.state.soapEditId;
    let soapImageId = this.state.soapImageId;
    let data = {
      'name': soapName,
      'price': soapPrice,
      'ingredients': soapIngredients,
      'image': imageFile
    };
    let formData = new FormData();
    let imageFileUpdate = document.querySelector('#fileUpdate');
    formData.append("file", imageFileUpdate.files[0]);

    if (imageFileUpdate.files[0]) {
      _utils_API__WEBPACK_IMPORTED_MODULE_4__["default"].updateProduct(soapId, data).then(res => {
        // console.log('UPDATE PRODUCT RESULT: ', res)
        // this.closeEditModal()
        axios__WEBPACK_IMPORTED_MODULE_3___default.a.delete( true ? "http://localhost:3000/uploads/" : undefined, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        axios__WEBPACK_IMPORTED_MODULE_3___default.a.post( true ? "http://localhost:3000/upload/" : undefined, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].success('Product successfully updated!', 5000);
        this.fetchData();
        this.closeEditModal();
      }).catch(err => {
        rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].error('There was an error updating the product. Please try again.', 10000);
        console.log('ERROR UPDATING PRODUCT: ', err);
      });
    } else {
      let soapImages = this.state.productImages;
      let soapOriginalName = this.state.soapOriginalName;
      console.log('PRODUCT IMAGES: ', soapImages);
      console.log('SOAP SEARCH: ', soapOriginalName);
      let oldImageFile = soapImages.filter(soap => {
        return soap.productId === soapOriginalName;
      });
      let soapFile = oldImageFile;
      let soapFileId = oldImageFile[0].filename;
      console.log('soap file: ', soapFile);
      console.log('FILENAME FOUND: ', soapFileId);

      if (soapFileId) {
        _utils_API__WEBPACK_IMPORTED_MODULE_4__["default"].updateProduct(soapId, data).then(res => {
          // console.log('UPDATE PRODUCT RESULT: ', res)
          // this.closeEditModal()
          axios__WEBPACK_IMPORTED_MODULE_3___default.a.put( true ? "http://localhost:3000/uploads/" : undefined, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].success('Product successfully updated!', 5000);
          this.closeEditModal();
          window.location.reload();
        }).catch(err => {
          rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].error('There was an error updating the product. Please try again.', 10000);
          console.log('ERROR UPDATING PRODUCT: ', err);
        });
      } else {
        rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].error('No matching images found.', 5000);
        return;
      }
    } // console.log('SOAP UPDATE ID: ', soapId)
    // console.log('SOAP UPDATE DATA: ', data)
    // console.log('SOAP UPDATE IMAGE ID: ', soapImageId)

  }

  async removeFromInventory() {
    // console.log(e.target)
    // let soap = e.target
    let soapId = this.state.soapEditId; // console.log('DELETE THIS SOAP: ', soapId)

    _utils_API__WEBPACK_IMPORTED_MODULE_4__["default"].removeProduct(soapId).then(res => {
      // console.log('REMOVE PRODUCT RESULT: ', res)
      rsuite__WEBPACK_IMPORTED_MODULE_2__["Alert"].success('Product was successfully removed.', 5000);
      this.closeEditModal();
      this.fetchData();
    }).catch(err => {
      console.log('ERROR REMOVING PRODUCT: ', err);
    });
  }

  closeEditModal() {
    this.fetchData();
    this.setState({
      showEditModal: false,
      qty: 'qty'
    });
  }

  closeAddModal() {
    this.fetchData();
    this.setState({
      showAddModal: false,
      qty: 'qty'
    });
  }

  render() {
    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("div", {
      id: "inventory",
      children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(_nav_NavbarAdmin_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 438,
        columnNumber: 13
      }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("span", {
        children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("div", {
          className: "row inventoryTitleRow",
          children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("p", {
            className: "inventoryTitle",
            children: "Inventory"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 441,
            columnNumber: 19
          }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Form"], {
            id: "adminInventorySearchBarForm",
            onChange: event => this.handleSearchEntry(event),
            children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], {
              id: "adminInventorySearchBarFormGroup",
              children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
                name: "searchEntry",
                type: "text",
                className: "form-control inventorySearchBarFromEntry",
                id: "searchEntry",
                placeholder: "Search by name"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 445,
                columnNumber: 23
              }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Icon"], {
                className: "searchIcon",
                icon: "search",
                size: "lg"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 452,
                columnNumber: 23
              }, this)]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 444,
              columnNumber: 21
            }, this)
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 443,
            columnNumber: 19
          }, this)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 440,
          columnNumber: 17
        }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("div", {
          id: "productsImagesRow1",
          className: "row",
          children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Modal"], {
            show: this.state.showAddModal,
            onHide: this.closeAddModal,
            children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Modal"].Header, {
              children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Modal"].Title, {
                children: this.state.soapName
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 461,
                columnNumber: 23
              }, this)
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 460,
              columnNumber: 21
            }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Modal"].Body, {
              children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Form"], {
                id: "addInventoryForm",
                encType: "multipart/form-data",
                action: "/products",
                method: "POST",
                children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], {
                  className: "adminAddFormGroup",
                  children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["ControlLabel"], {
                    className: "inventoryFormLabel",
                    htmlFor: "name",
                    children: "Soap Name"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 466,
                    columnNumber: 27
                  }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
                    name: "soapName",
                    type: "text",
                    className: "form-control inventoryFormEntry",
                    id: "soapName",
                    placeholder: "Soap Name"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 472,
                    columnNumber: 27
                  }, this)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 465,
                  columnNumber: 25
                }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], {
                  className: "adminAddFormGroup",
                  children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["ControlLabel"], {
                    className: "inventoryFormLabel",
                    htmlFor: "price",
                    children: "Price"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 482,
                    columnNumber: 27
                  }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
                    name: "soapPrice",
                    type: "text" // min={0}
                    ,
                    className: "form-control inventoryFormEntry",
                    id: "soapPrice",
                    placeholder: "Price"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 488,
                    columnNumber: 27
                  }, this)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 481,
                  columnNumber: 25
                }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], {
                  className: "adminAddFormGroup",
                  children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["ControlLabel"], {
                    id: "ingredientsLabel",
                    className: "inventoryFormLabel",
                    htmlFor: "ingredients",
                    children: "Soap Ingredients"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 498,
                    columnNumber: 27
                  }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
                    id: "soapIngredients",
                    rows: 5,
                    name: "soapIngredients",
                    componentClass: "textarea",
                    placeholder: "Ingredients..."
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 505,
                    columnNumber: 27
                  }, this)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 497,
                  columnNumber: 25
                }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], {
                  className: "adminAddFormGroup",
                  children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["ControlLabel"], {
                    className: "inventoryFormLabel",
                    htmlFor: "file",
                    children: "Soap Image"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 514,
                    columnNumber: 27
                  }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("input", {
                    type: "file",
                    id: "fileAdd",
                    name: "file",
                    onChange: this.handleFileSelection
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 520,
                    columnNumber: 27
                  }, this)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 513,
                  columnNumber: 25
                }, this)]
              }, void 0, true, {
                fileName: _jsxFileName,
                lineNumber: 464,
                columnNumber: 23
              }, this)
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 463,
              columnNumber: 21
            }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Modal"].Footer, {
              children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Button"], {
                onClick: this.addToInventory,
                children: "Add to Inventory"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 540,
                columnNumber: 23
              }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Button"], {
                onClick: this.closeAddModal,
                children: "Cancel"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 543,
                columnNumber: 23
              }, this)]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 539,
              columnNumber: 21
            }, this)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 459,
            columnNumber: 19
          }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Modal"], {
            show: this.state.showEditModal,
            onHide: this.closeEditModal,
            children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Modal"].Header, {
              children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Modal"].Title, {
                children: this.state.soapName
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 552,
                columnNumber: 23
              }, this)
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 551,
              columnNumber: 21
            }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Modal"].Body, {
              children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Form"], {
                id: "inventoryForm",
                onChange: event => this.handleEditInventory(event),
                children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], {
                  className: "adminAddFormGroup",
                  children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["ControlLabel"], {
                    className: "inventoryFormLabel",
                    htmlFor: "name",
                    children: "Soap Name"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 557,
                    columnNumber: 27
                  }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
                    disabled: true,
                    name: "soapEditName",
                    type: "text",
                    className: "form-control inventoryFormEntry",
                    id: "soapEditName",
                    value: this.state.soapEditName
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 558,
                    columnNumber: 27
                  }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("small", {
                    id: "usernameError",
                    className: "form-text text-muted",
                    children: this.state.nameTaken
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 566,
                    columnNumber: 27
                  }, this)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 556,
                  columnNumber: 25
                }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], {
                  className: "adminAddFormGroup",
                  children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["ControlLabel"], {
                    className: "inventoryFormLabel",
                    htmlFor: "price",
                    children: "Price"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 569,
                    columnNumber: 27
                  }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
                    disabled: true,
                    name: "soapEditPrice",
                    type: "text" // min={0}
                    ,
                    className: "form-control inventoryFormEntry",
                    id: "soapEditPrice",
                    value: this.state.soapEditPrice // onChange={this.handleEditInventory}                              

                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 575,
                    columnNumber: 27
                  }, this)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 568,
                  columnNumber: 25
                }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], {
                  className: "adminAddFormGroup",
                  children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["ControlLabel"], {
                    id: "ingredientsLabel",
                    className: "inventoryFormLabel",
                    htmlFor: "ingredients",
                    children: "Soap Ingredients"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 587,
                    columnNumber: 27
                  }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
                    disabled: true,
                    id: "soapEditIngredients",
                    rows: 5,
                    name: "soapEditIngredients",
                    componentClass: "textarea",
                    value: this.state.soapEditIngredients // onChange={this.handleEditInventory}

                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 595,
                    columnNumber: 27
                  }, this)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 586,
                  columnNumber: 25
                }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], {
                  className: "adminAddFormGroup",
                  children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["ControlLabel"], {
                    className: "inventoryFormLabel",
                    htmlFor: "img",
                    children: "Soap Image"
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 606,
                    columnNumber: 27
                  }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("input", {
                    type: "file",
                    id: "fileUpdate",
                    name: "file",
                    onChange: this.handleFileSelection
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 624,
                    columnNumber: 27
                  }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["HelpBlock"], {
                    id: "editImageHelpBlock",
                    children: this.state.soapEditFile
                  }, void 0, false, {
                    fileName: _jsxFileName,
                    lineNumber: 625,
                    columnNumber: 27
                  }, this)]
                }, void 0, true, {
                  fileName: _jsxFileName,
                  lineNumber: 605,
                  columnNumber: 25
                }, this)]
              }, void 0, true, {
                fileName: _jsxFileName,
                lineNumber: 555,
                columnNumber: 23
              }, this)
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 554,
              columnNumber: 21
            }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Modal"].Footer, {
              id: "adminEditInventoryModalFooter",
              children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Button"], {
                onClick: this.editInventory,
                children: "Edit"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 631,
                columnNumber: 23
              }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Button"], {
                onClick: e => this.submitEditInventory(this.state.soapId),
                children: "Submit Changes"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 634,
                columnNumber: 23
              }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Button"], {
                onClick: this.removeFromInventory,
                children: "Delete from Inventory"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 637,
                columnNumber: 23
              }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Button"], {
                onClick: this.closeEditModal,
                children: "Cancel"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 640,
                columnNumber: 23
              }, this)]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 630,
              columnNumber: 21
            }, this)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 550,
            columnNumber: 19
          }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Panel"], {
            className: "addProductPanel productsImagePanel",
            shaded: true,
            bordered: true,
            bodyFill: true,
            style: {
              display: 'inline-block'
            },
            children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Icon"], {
              icon: "plus-square",
              onClick: this.openAddModal,
              id: "addProductImage"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 648,
              columnNumber: 21
            }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Panel"], {
              className: "productsImageHeader",
              header: "Add a Product"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 649,
              columnNumber: 23
            }, this)]
          }, void 0, true, {
            fileName: _jsxFileName,
            lineNumber: 647,
            columnNumber: 19
          }, this), this.state.filteredProducts.map((product, i) => /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("span", {
            children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Panel"], {
              className: "productsImagePanel",
              shaded: true,
              bordered: true,
              bodyFill: true,
              style: {
                display: 'inline-block'
              },
              children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])("img", {
                // src={(process.env.NODE_ENV === "development" ? this.state.developmentImageURL : this.state.productionImageURL) + product.soapImageFile ? product.soapImageFile : product.image} 
                src: `uploads/${product.soapImageFile}`,
                "data-soapname": product.name,
                "data-soapprice": product.price,
                "data-soapimage": product.soapImageFile,
                "data-soapid": product._id,
                "data-soapfile": product.image,
                "data-soapimageid": product.soapImageId,
                "data-soapingredients": product.ingredients ? product.ingredients : 'No ingredients listed.',
                onClick: this.openEditModal,
                className: "productsImage",
                alt: "soap name"
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 656,
                columnNumber: 27
              }, this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_8__["jsxDEV"])(rsuite__WEBPACK_IMPORTED_MODULE_2__["Panel"], {
                className: "productsImageHeader",
                header: product.name
              }, void 0, false, {
                fileName: _jsxFileName,
                lineNumber: 670,
                columnNumber: 27
              }, this)]
            }, void 0, true, {
              fileName: _jsxFileName,
              lineNumber: 655,
              columnNumber: 23
            }, this)
          }, product._id, false, {
            fileName: _jsxFileName,
            lineNumber: 654,
            columnNumber: 21
          }, this))]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 457,
          columnNumber: 17
        }, this)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 439,
        columnNumber: 15
      }, this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 436,
      columnNumber: 11
    }, this);
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Inventory);

const currentExports = __react_refresh_utils__.getModuleExports(module.i);
__react_refresh_utils__.registerExportsForReactRefresh(currentExports, module.i);

if (true) {
  const isHotUpdate = !!module.hot.data;
  const prevExports = isHotUpdate ? module.hot.data.prevExports : null;

  if (__react_refresh_utils__.isReactRefreshBoundary(currentExports)) {
    module.hot.dispose(
      /**
       * A callback to performs a full refresh if React has unrecoverable errors,
       * and also caches the to-be-disposed module.
       * @param {*} data A hot module data object from Webpack HMR.
       * @returns {void}
       */
      function hotDisposeCallback(data) {
        // We have to mutate the data object to get data registered and cached
        data.prevExports = currentExports;
      }
    );
    module.hot.accept(
      /**
       * An error handler to allow self-recovering behaviours.
       * @param {Error} error An error occurred during evaluation of a module.
       * @returns {void}
       */
      function hotErrorHandler(error) {
        if (
          typeof __react_refresh_error_overlay__ !== 'undefined' &&
          __react_refresh_error_overlay__
        ) {
          __react_refresh_error_overlay__.handleRuntimeError(error);
        }

        if (typeof __react_refresh_test__ !== 'undefined' && __react_refresh_test__) {
          if (window.onHotAcceptError) {
            window.onHotAcceptError(error.message);
          }
        }

        __webpack_require__.c[module.i].hot.accept(hotErrorHandler);
      }
    );

    if (isHotUpdate) {
      if (
        __react_refresh_utils__.isReactRefreshBoundary(prevExports) &&
        __react_refresh_utils__.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)
      ) {
        module.hot.invalidate();
      } else {
        __react_refresh_utils__.enqueueUpdate(
          /**
           * A function to dismiss the error overlay after performing React refresh.
           * @returns {void}
           */
          function updateCallback() {
            if (
              typeof __react_refresh_error_overlay__ !== 'undefined' &&
              __react_refresh_error_overlay__
            ) {
              __react_refresh_error_overlay__.clearRuntimeErrors();
            }
          }
        );
      }
    }
  } else {
    if (isHotUpdate && __react_refresh_utils__.isReactRefreshBoundary(prevExports)) {
      module.hot.invalidate();
    }
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js"), __webpack_require__(/*! ./node_modules/react-dev-utils/refreshOverlayInterop.js */ "./node_modules/react-dev-utils/refreshOverlayInterop.js")))

/***/ })

})
//# sourceMappingURL=main.a4dc0e0098b65bb0ebfa.hot-update.js.map