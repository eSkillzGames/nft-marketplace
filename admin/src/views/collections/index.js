import React from 'react'
import { CSpinner, CFormSelect, CForm, CRow, CFormInput, CCard, CCardBody, CCardHeader, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import { useEffect, useState } from 'react'
const axios = require('axios')

const Web3 = require('web3')
const MarketContractInfo = require('./../../ABIs/VersusXMarket.json')

console.log(process.env.REACT_APP_INFURA_KEY, process.env.REACT_APP_MARKETPLACE);
let web3 = new Web3(process.env.REACT_APP_INFURA_KEY);
let MarketContract = new web3.eth.Contract(MarketContractInfo.abi, process.env.REACT_APP_MARKETPLACE);

const fNewCollection = async (name, symbol, type) => {
  try {
    console.log(process.env.REACT_APP_TREASURY_ADDRESS);
    var count = await web3.eth.getTransactionCount(process.env.REACT_APP_TREASURY_ADDRESS, "latest"); //get latest nonce
    var nonce = count;
    var gasPrice = 80000000000;
    var chainId = 80001;

    let tx = MarketContract.methods.addCollection(type == "ERC721" ? "0" : "1", name, symbol);
    let gas = await tx.estimateGas({ from: process.env.REACT_APP_TREASURY_ADDRESS });
    let data = tx.encodeABI();
    let signedTx = await web3.eth.accounts.signTransaction(
      {
        to: process.env.REACT_APP_MARKETPLACE,
        data,
        gas: gas * 2,
        gasPrice,
        nonce,
        chainId
      },
      process.env.REACT_APP_TREASURY_PRIVATEKEY
    );
    let transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(transactionReceipt);

    return transactionReceipt.logs[0].address;
  }
  catch (err) {
    console.log(err);
    return "";
  }
}

function CollectionPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [collectionData, setCollectionData] = useState([])
  const [showCollectionDlg, setCollectionDlg] = useState(false)
  const [propertyList, setPropertyList] = useState([])
  const [newProperty, setNewProperty] = useState("")
  const [collectionType, setCollectionType] = useState("ERC721")
  const [collectionName, setCollectionName] = useState("")
  const [collectionSymbol, setCollectionSymbol] = useState("")
  const [showEditCollectionDlg, setEditCollectionDlg] = useState(false)
  const [collectionInfo, setCollectionInfo] = useState({});


  useEffect(() => {
    getAllCollections()
  }, [])

  const getAllCollections = async () => {
    console.log('API URL', process.env.REACT_APP_BASE_URL)
    try {
      const res = await axios({
        method: 'post',
        url: process.env.REACT_APP_BASE_URL + '/getCollections',
        data: {},
        headers: {
          'Content-Type': `application/json`,
        },
      })
      if (res.data.status == true) {
        console.log(res.data.data)
        setCollectionData(res.data.data);
      }
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }

  const onEditCollection = async (id) => {
    try {
      const res = await axios({
        method: 'post',
        url: process.env.REACT_APP_BASE_URL + '/getCollectionInfoById',
        data: {
          id: id
        },
        headers: {
          'Content-Type': `application/json`,
        },
      });
      if (res.data.status == true) {
        console.log(res.data.data)
        let info = res.data.data;
        info.properties = info.properties.trim().split(',');
        setCollectionInfo(info);
        setEditCollectionDlg(true);
      }
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }

  const onSaveCollection = async () => {
    try {
      const res = await axios({
        method: 'post',
        url: process.env.REACT_APP_BASE_URL + '/saveCollection',
        data: {
          ...collectionInfo,
          properties: collectionInfo.properties.toString()
        },
        headers: {
          'Content-Type': `application/json`,
        },
      });
      if (res.data.status == true) {
        setCollectionData(res.data.data);
        setEditCollectionDlg(false);
      }
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }

  const onDeleteCollection = async (id) => {
    setIsLoading(true)
    try {
      const res = await axios({
        method: 'post',
        url: process.env.REACT_APP_BASE_URL + '/deleteCollections',
        data: { id: id },
        headers: {
          'Content-Type': `application/json`,
        },
      })
      if (res.data.status == true) {
        console.log(res.data.data)
        setCollectionData(res.data.data);
      }
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }

  const onCloseCollectionDialog = () => {
    setCollectionName("");
    setCollectionSymbol("");
    setNewProperty("");
    setPropertyList([]);
    setCollectionDlg(false);
  }
  const onAddCollection = async () => {
    if (collectionName == "" || collectionSymbol == "" || isLoading) {
      return;
    }
    setIsLoading(true);

    setCollectionDlg(false);
    let newAddress = await fNewCollection(collectionName, collectionSymbol, collectionType);
    if (newAddress == "") {
      return;
    }

    let addData = {
      name: collectionName,
      symbol: collectionSymbol,
      type: collectionType,
      properties: propertyList.join(","),
      address: newAddress
    };
    console.log(addData);
    try {
      const res = await axios({
        method: 'post',
        url: process.env.REACT_APP_BASE_URL + '/addCollection',
        data: addData,
        headers: {
          'Content-Type': `application/json`,
        },
      })
      if (res.data.status == true) {
        console.log(res.data.data)
        setCollectionData(res.data.data);
        onCloseCollectionDialog();
      }
      setIsLoading(false)
    } catch {
      setIsLoading(false)
    }
  }

  const onDeleteProperty = (prop) => {
    let newList = propertyList.filter(item => item !== prop);
    console.log(newList);
    setPropertyList(newList);
  }

  return (
    <CCard>
      <CCardHeader style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Collections <CButton color="success" onClick={() => { setCollectionDlg(true) }}>Add</CButton></CCardHeader>
      <CCardBody>
        {isLoading && <CSpinner color="primary" />}
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Symbol</CTableHeaderCell>
              <CTableHeaderCell scope="col">Type</CTableHeaderCell>
              <CTableHeaderCell scope="col">Address</CTableHeaderCell>
              <CTableHeaderCell scope="col" colSpan={2}>Manage</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {collectionData.map((e, i) => {
              return (
                <CTableRow>
                  <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                  <CTableDataCell>{e.collection_name}</CTableDataCell>
                  <CTableDataCell>{e.collection_symbol}</CTableDataCell>
                  <CTableDataCell>{e.collection_type}</CTableDataCell>
                  <CTableDataCell>{e.collection_address}</CTableDataCell>
                  <CTableDataCell><CIcon icon={cilPencil} size="sm" style={{ '--ci-primary-color': 'blue' }} onClick={() => onEditCollection(e.id)} /></CTableDataCell>
                  <CTableDataCell><CIcon icon={cilTrash} size="sm" style={{ '--ci-primary-color': 'red' }} onClick={() => onDeleteCollection(e.id)} /></CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>

        <CModal
          visible={showCollectionDlg}
          size='lg'
          onClose={() => onCloseCollectionDialog()}
        >
          <CModalHeader onClose={() => onCloseCollectionDialog()}>
            <CModalTitle id="LiveDemoExampleLabel">Add Collection</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3">
              <CCol sm={6} md={6}>
                <CFormInput type="text" placeholder="Name" label="Name" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
              </CCol>
              <CCol sm={6} md={6} className='mb-1'>
                <CFormInput type="text" placeholder="Symbol" label="Symbol" value={collectionSymbol} onChange={(e) => setCollectionSymbol(e.target.value)} />
              </CCol>
              {propertyList.map((propertyItem, propertyIndex) => (
                <CCol xs={12} style={{ display: "flex" }} key={"property_" + propertyIndex}>
                  <CFormInput type="text" value={propertyItem} label="Field" defaultValue={propertyItem} readOnly={true} />
                  <CButton color="danger" className="ms-3" onClick={() => {
                    onDeleteProperty(propertyItem);
                  }}>
                    Delete
                  </CButton>
                </CCol>
              ))}
              <CCol xs={12} style={{ display: "flex" }}>
                <CFormInput type="text" placeholder="Field" label="Field" defaultValue="" value={newProperty} onChange={(e) => setNewProperty(e.target.value)} />
                <CButton color="primary" className="ms-3" onClick={() => {
                  setPropertyList([...propertyList, newProperty]);
                  console.log(propertyList);
                  setNewProperty("");
                }}>
                  Add
                </CButton>
              </CCol>
              <CCol sm={3}>
                <CFormSelect id="inputState" label="State" value={collectionType} onChange={(e) => { setCollectionType(e.target.value) }}>
                  <option value={"ERC721"}>ERC721</option>
                  <option value={"ERC1155"}>ERC1155</option>
                </CFormSelect>
              </CCol>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => onCloseCollectionDialog()}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={() => onAddCollection()}>Add Collection</CButton>
          </CModalFooter>
        </CModal>


        <CModal
          visible={showEditCollectionDlg}
          size='lg'
          onClose={() => {setEditCollectionDlg(false)}}
        >
          <CModalHeader onClose={() => {setEditCollectionDlg(false)}}>
            <CModalTitle id="LiveDemoExampleLabel">Edit Collection</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3">
              <CCol sm={6} md={6}>
                <CFormInput type="text" placeholder="Name" label="Name" value={collectionInfo.collection_name} onChange={(e) => {
                  setCollectionInfo({
                    ...collectionInfo,
                    collection_name: e.target.value
                  })
                }} />
              </CCol>
              <CCol sm={6} md={6} className='mb-1'>
                <CFormInput type="text" placeholder="Symbol" label="Symbol" value={collectionInfo.collection_symbol} onChange={(e) => {
                  setCollectionInfo({
                    ...collectionInfo,
                    collection_symbol: e.target.value
                  })
                }} />
              </CCol>
              {collectionInfo.properties && collectionInfo.properties.map((propertyItem, propertyIndex) => (
                <CCol xs={12} style={{ display: "flex" }} key={"property_" + propertyIndex}>
                  <CFormInput type="text" value={propertyItem} label="Field" defaultValue={propertyItem} readOnly={true} />
                  <CButton color="danger" className="ms-3" onClick={() => {
                    let oldProperties = collectionInfo.properties.filter(item => item !== propertyItem);
                    setCollectionInfo({
                      ...collectionInfo,
                      properties: oldProperties
                    });
                  }}>
                    Delete
                  </CButton>
                </CCol>
              ))}
              <CCol xs={12} style={{ display: "flex" }}>
                <CFormInput type="text" placeholder="Field" label="Field" defaultValue="" value={newProperty} onChange={(e) => setNewProperty(e.target.value)} />
                <CButton color="primary" className="ms-3" onClick={() => {
                  let properties = [...collectionInfo.properties, newProperty];
                  setCollectionInfo({
                    ...collectionInfo,
                    properties: properties
                  });
                  setNewProperty("");
                }}>
                  Add
                </CButton>
              </CCol>
              <CCol sm={3}>
                <CFormSelect id="inputState" label="State" value={collectionType} onChange={(e) => { 
                  setCollectionInfo({
                    ...collectionInfo,
                    collection_type: e.target.value
                  });
                 }}>
                  <option value={"ERC721"}>ERC721</option>
                  <option value={"ERC1155"}>ERC1155</option>
                </CFormSelect>
              </CCol>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => {
              setEditCollectionDlg(false);
            }}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={() => onSaveCollection()}>Save Collection</CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  )
}

export default CollectionPage
