import React, { useRef } from 'react'
import { CFormTextarea, CSpinner, CFormSelect, CForm, CRow, CFormInput, CCard, CCardBody, CCardHeader, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CCol } from '@coreui/react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
const axios = require('axios')

const Web3 = require('web3')
const VersusX721Info = require('./../../ABIs/VersusX721.json')
const VersusX1155Info = require('./../../ABIs/VersusX1155.json')

let web3 = new Web3(process.env.REACT_APP_INFURA_KEY);

async function mintNft(_tokenUri, nftType, nftAddress, userAddress, quantity) {
  try {
    let nftContract = new web3.eth.Contract(nftType == "ERC721" ? VersusX721Info.abi : VersusX1155Info.abi, nftAddress);

    var count = await web3.eth.getTransactionCount(process.env.REACT_APP_TREASURY_ADDRESS, "latest"); //get latest nonce
    var nonce = count;
    var gasPrice = 80000000000;
    var chainId = 80001;

    let tx;
    console.log(_tokenUri, nftType, nftAddress, userAddress, quantity);
    if (nftType == "ERC721") {
      tx = userAddress == "" ?
        nftContract.methods.createToken(_tokenUri) :
        nftContract.methods.createTokenToUser(userAddress, _tokenUri);
    } else {
      tx = userAddress == "" ?
        nftContract.methods.createToken(_tokenUri, quantity) :
        nftContract.methods.createTokenToUser(userAddress, _tokenUri, quantity);
    }
    let gas = await tx.estimateGas({ from: process.env.REACT_APP_TREASURY_ADDRESS });
    let data = tx.encodeABI();
    let signedTx = await web3.eth.accounts.signTransaction(
      {
        to: nftAddress,
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

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function MintPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [quantity, setQuantity] = React.useState(1)
  const [imgHash, setImgHash] = React.useState('')
  const [imgSrc, setImgSrc] = React.useState('')
  const [imgName, setImageName] = React.useState('')
  const [imgDescription, setImageDescription] = React.useState('')
  const [supportAddress, setSupportAddress] = useState('')

  const [collectionData, setCollectionData] = useState([])
  const [curNFT, setCurNFT] = useState("")
  const [curNFTType, setCurNFTType] = useState("")
  const [properties, setProperties] = useState([])
  const [inputData, setInputData] = useState({})
  const [type, setType] = useState("COMMON")

  const fileRef = useRef(null);

  const upload = async (e) => {
    try {
      setImgHash('Pending')
      setImgSrc('Pending')

      var _URL = window.URL || window.webkitURL
      var file, img
      if (e.target.files.length > 0) {
        file = e.target.files[0]
        if (file.type == 'image/png' || file.type == 'image/jpeg') {
          img = new Image()
          var objectUrl = _URL.createObjectURL(file)
          img.onload = async function () {
            if (this.width <= 1024 && this.height <= 1024) {
              _URL.revokeObjectURL(objectUrl)
              setImgHash('Pending')

              // const addedToIPFS = await ipfsC.add(file);
              const formData = new FormData()
              formData.append('file', file)

              const resFile = await axios({
                method: 'post',
                url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
                data: formData,
                headers: {
                  pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
                  pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
                  // "Content-Type": "multipart/form-data"
                  'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                },
              })
              setImgHash(resFile.data.IpfsHash);
              setImgSrc(URL.createObjectURL(file));
            } else {
              setImgSrc('')
            }
          }
          img.src = objectUrl
        } else {
          setImgHash('Pending')
          setImgSrc('Pending')
          const formData = new FormData()
          formData.append('file', file)

          const resFile = await axios({
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
            data: formData,
            headers: {
              pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
              pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
              // "Content-Type": "multipart/form-data"
              'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            },
          })
          setImgHash(resFile.data.IpfsHash)
          setImgSrc(file.name)
        }
      }
    } catch {
      setImgSrc("");
      return;
    }
  }

  const uploadMetaData = async () => {
    try {
      setIsLoading(true);
      let metadata = { ...inputData };
      metadata.name = imgName;
      metadata.image_url = imgHash != "" ? "https://eskillzpool.mypinata.cloud/ipfs/" + imgHash : "";
      metadata.description = imgDescription;
      metadata.type = type;

      const pinataResponse = await pinJSONToIPFS(metadata)
      if (!pinataResponse.success) {
        // setMetadaState('😢 Something went wrong while uploading your tokenURI.')
      } else {
        // setMetadaState('PinataHash : ' + pinataResponse.pinataUrl)
        const tokenURI = pinataResponse.pinataUrl

        let mintNftRes = await mintNft(tokenURI, curNFTType, curNFT, supportAddress, quantity);
        if (mintNftRes == true) {
          setImageName('')
          setImageDescription('')
          setInputData({});
          setImgSrc('')
          setImgHash('')
          setQuantity(1);
          setSupportAddress("");
          if (quantity == 1) {
            window.alert('1 minted successfully')
          } else {
            window.alert(quantity + ' minted successfully')
          }
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err)
      setIsLoading(false);
    }
  }

  const pinJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
    //making axios POST request to Pinata ⬇️
    return axios
      .post(url, JSONBody, {
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      })
      .then(function (response) {
        return {
          success: true,
          pinataUrl: 'https://eskillzpool.mypinata.cloud/ipfs/' + response.data.IpfsHash,
        }
      })
      .catch(function (error) {
        console.log(error)
        return {
          success: false,
          message: error.message,
        }
      })
  }

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

  const onChangeCollection = (val) => {
    setCurNFT(val.target.value);
  }

  useEffect(() => {
    if (collectionData.length > 0) {
      setCurNFT(collectionData[0].collection_address);
      setCurNFTType(collectionData[0].collection_type);
    }
  }, [collectionData]);

  useEffect(() => {
    let curCollectionInfo = collectionData.find((e) => {
      if (e.collection_address == curNFT) {
        return e;
      }
    });
    if (curCollectionInfo) {
      let propRes = curCollectionInfo.properties == "" ? [] : curCollectionInfo.properties.split(",");
      console.log(propRes);
      setInputData({});
      setProperties(propRes);
      setCurNFTType(curCollectionInfo.collection_type);
    }
  }, [curNFT]);


  return (
    <div>
      <CCard>
        <CCardHeader>Mint</CCardHeader>
        <CCardBody>
          {isLoading && <CSpinner color="primary" />}
          <CRow className='g-3'>
            <CCol sm={3}>
              <CFormSelect id="inputState" label="State" value={curNFT} onChange={(e) => { onChangeCollection(e); }}>
                {collectionData.map(e => (
                  <option value={e.collection_address}>{e.collection_name}</option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol sm={9}>
              <CButton color="danger" variant="outline" size="sm" style={{ marginTop: "4px" }}>{curNFTType}</CButton>
            </CCol>
          </CRow>
          <CRow className='g-3 mt-3'>
            <CCol sm={6} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                border: "1.5px dashed #41585F",
                backgroundColor: "#f7f7f7",
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxHeight: "400px",
                height: (imgSrc != "" && imgSrc != "Pending") ? "auto" : "100%",
                width: "100%",
                overflow: "hidden"
              }} onClick={() => {
                fileRef.current.click();
              }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept={['image/jpeg', 'image/png', 'video/mp4']}
                  maxSize={1024 * 1024 * 10}
                  style={{ display: 'none' }}
                  id="contained-button-file"
                  onChange={(e) => {
                    upload(e)
                  }}
                />
                {(imgSrc == "") && (
                  <div style={{
                    padding: "8px 24px",
                    textAlign: "center"
                  }}>
                    <div>
                      <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloudUploadIcon" style={{
                        width: "40px",
                        height: "40px",
                        fill: "#1976d2",
                      }}>
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path>
                      </svg>
                    </div>
                    <div style={{ marginTop: '8px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: "bold", fontSize: "18px" }}>Upload your file here</div>
                    <div style={{ fontSize: "14px" }}>JPG, PNG or MP4 videos accepted.<br />1024x1024 limit.</div>
                  </div>
                )}
                {imgSrc == "Pending" && (
                  <CSpinner color="primary" />
                )}
                {(imgSrc != "" && imgSrc != "Pending") && (
                  <div>
                    {/* <span style={{ margin: '20px 0px 0px 0px' }}>{imgNameUpload}</span> */}
                    <img id="output" src={imgSrc} style={{ width: "100%" }} />
                  </div>
                )}
              </div>
            </CCol>
            <CCol sm={6} style={{ borderLeft: "1px dashed lightgray" }}>
              <CRow className="g-3">
                <CCol xs={12}>
                  Name
                  <CFormInput type="text" placeholder={"Name"} value={imgName} onChange={(val) => {
                    setImageName(val.target.value);
                  }} />
                </CCol>
                <CCol xs={12}>
                  Description
                  <CFormTextarea
                    rows={3}
                    placeholder={"Description"}
                    value={imgDescription} onChange={(val) => {
                      setImageDescription(val.target.value);
                    }}
                  ></CFormTextarea>
                </CCol>
                <CCol xs={12}>
                  Type
                  <CFormSelect id="inputState" label="State" value={type} onChange={(e) => { setType(e.target.value) }}>
                    <option value={"COMMON"}>COMMON</option>
                    <option value={"UNCOMMON"}>UNCOMMON</option>
                    <option value={"RARE"}>RARE</option>
                    <option value={"EPIC"}>EPIC</option>
                    <option value={"LEGENDARY"}>LEGENDARY</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <div style={{ background: "lightgray", height: "1px", margin: "24px 36px" }}></div>
              <CRow className="g-3">
                {properties.map(e => (
                  <CCol xs={12}>
                    {e.toUpperCase()}
                    <CFormInput type="text" label={e} value={inputData[e] || ''} onChange={(val) => {
                      let temp = { ...inputData }
                      temp[e] = val.target.value
                      setInputData(temp)
                    }} />
                  </CCol>
                ))}
              </CRow>
              <div style={{ background: "lightgray", height: "1px", margin: "24px 36px" }}></div>
              <CRow className="g-3">
                {curNFTType == "ERC1155" && (
                  <CCol xs={12}>
                    Quantity
                    <CFormInput type="number" placeholder={"Quantity"} value={quantity} onChange={(val) => {
                      setQuantity(val.target.value);
                    }} />
                  </CCol>
                )}
                <CCol xs={12}>
                  User Address
                  <CFormInput type="text" placeholder={"0x...."} value={supportAddress} onChange={(val) => {
                    setSupportAddress(val.target.value);
                  }} />
                </CCol>
              </CRow>
            </CCol>
          </CRow>

          <div style={{ background: "lightgray", height: "2px", margin: "24px 36px" }}></div>
          <CRow className="g-3">
            <CCol xs={12} style={{ textAlign: "center" }}>
              <CButton color="primary" size="lg" onClick={() => { uploadMetaData() }}>
                SUBMIT
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div >
  )
}

export default MintPage
