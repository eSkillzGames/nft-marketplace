import React, { useState } from "react";
import { Box, Typography, Modal, Grid, Divider } from "@mui/material";
import { Close } from "@mui/icons-material";
import VersusButton from "../VersusButton";
import VersusInput from "../VersusInput";
import { useSelector } from "react-redux";
import { ethers } from 'ethers'
import axios from "axios";

const VersusNFTDetail = (props) => {
  const [size, setSize] = useState([0, 0]);
  React.useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ background: "rgba(0,0,0,0.9)" }}
    >
      <Box
        sx={{
          color: "white",
          padding: "7px",
          border: "1px solid #0697c2",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
        }}
      >
        <Box
          sx={{
            color: "white",
            background: "#2AA8DB33",
          }}
        >
          <Box textAlign="center" p={1}>
            <Typography variant="subtitle1" fontWeight="bold" color="white">
              NFT Details
            </Typography>
            <Close
              color="white"
              style={{ position: "absolute", right: "16px", top: "16px" }}
              onClick={props.handleClose}
            />
          </Box>
          <Box padding="2rem" display={"flex"} bgcolor={"#2AA8DB33"} minHeight={"400px"} maxHeight={"80vh"} overflow={"auto"}>
            <Grid container >
              <Grid item sm={5} xs={12} style={{ marginBottom: size[0] > 576 ? "0px" : "2rem" }}>
                <Box
                  sx={{
                    border: "2px solid white",
                    borderRadius: "1rem",
                  }}
                  p={1}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <img
                    src={
                      props.nft.metadata.image_url
                        ? props.nft.metadata.image_url
                        : "/imgs/nft-default.png"
                    }
                    style={{ borderRadius: "0.5rem", width: "100%" }}
                  />
                </Box>
              </Grid>
              <Grid item sm={7} xs={12}>
                <Box ml={size[0] > 576 ? 3 : 0} overflow={"hidden"}>
                  <Typography variant="h6" fontWeight="bold" color="white">
                    {props.nft.metadata.name}
                  </Typography>
                  <img
                    src="/imgs/Divider.png"
                    style={{ margin: "0 0.5rem" }}
                    width="100%"
                  />
                  {props.nft.price && (
                    <Box display={"flex"} alignItems={"center"} mb={1}>
                      <img src="/imgs/matic-token-icon.png" />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="white"
                        ml={1}
                      >
                        {ethers.utils.formatEther(props.nft.price).toString()}
                      </Typography>
                    </Box>
                  )}
                  <VersusButton
                    label={props.buysell}
                    style={{ width: "fit-content" }}
                    onClick={() => {
                      if (props.buysell == "BUY") {
                        props.buyNft(props.nft.itemId, props.nft.price);
                      } else {
                        props.sellNft(
                          props.nft.id,
                          0.5 /*sellprice*/
                        );
                      }
                    }}
                  />
                  <Typography variant="subtitle2" color="white" my={2}>
                    {props.nft.metadata.description}
                  </Typography>
                  <Box
                    sx={{ border: "1px solid #00BDFF", borderRadius: "16px" }}
                    p={2}
                  >
                    {Object.keys(props.nft.metadata).map((e, index) => {
                      return e != "image_url" &&
                        e != "name" &&
                        e != "description" ? (
                        <Box display={"flex"} alignItems={"center"} key={index}>
                          <Typography variant="body2" color="white">
                            {e.toUpperCase()}:
                          </Typography>
                          <Typography variant="subtitle1" color="white" ml={1}>
                            {props.nft.metadata[e]}
                          </Typography>
                        </Box>
                      ) : (
                        <></>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

const VersusNFTConfirm = (props) => {
  const [sellprice, setSellPrice] = useState(0);
  const [size, setSize] = useState([0, 0]);

  React.useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ background: "rgba(0,0,0,0.9)" }}
    >
      <Box
        sx={{
          color: "white",
          padding: "7px",
          border: "1px solid #0697c2",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
        }}
      >
        <Box
          sx={{
            color: "white",
            background: "#2AA8DB33",
          }}
        >
          <Box textAlign="center" p={1}>
            <Typography variant="subtitle1" fontWeight="bold" color="white">
              NFT CheckOut
            </Typography>
            <Close
              color="white"
              style={{ position: "absolute", right: "16px", top: "16px" }}
              onClick={props.handleClose}
            />
          </Box>
          <Box padding={"2rem"} bgcolor={"#2AA8DB33"}>
            <Typography variant="h6" color="white" mb={1}>
              Item
            </Typography>
            <Box sx={{ background: "#2AA8DB", height: "2px" }} mb={2} />
            <Grid container>
              <Grid item sm={5} xs={12} style={{ marginBottom: size[0] > 576 ? "0" : "2rem" }}>
                <Box
                  sx={{
                    border: "2px solid white",
                    borderRadius: "16px",
                  }}
                  p={1}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <img
                    src={
                      props.nft.metadata.image_url
                        ? props.nft.metadata.image_url
                        : "/imgs/nft-default.png"
                    }
                    style={{ borderRadius: "8px", width: "100%" }}
                  />
                </Box>
              </Grid>
              <Grid item sm={7} xs={12}>
                <Box ml={size[0] > 576 ? 3 : 0} overflow={"hidden"}>
                  <Typography variant="h6" fontWeight="bold" color="white">
                    {props.nft.metadata.name}
                  </Typography>
                  <Typography variant="subtitle2" color="white" my={1}>
                    {props.nft.metadata.description}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ background: "#2AA8DB", height: "2px" }} mt={2} />
            <Box
              display="flex"
              alignItems={"center"}
              justifyContent={"space-between"}
              mt={1}
            >
              <Typography variant="h6" color="white">
                Price
              </Typography>
              {props.buysell == "BUY" && (
                <Box display={"flex"} alignItems={"center"}>
                  <img src="/imgs/matic-token-icon.png" />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="white"
                    ml={1}
                  >
                    {ethers.utils.formatEther(props.nft.price || "0").toString()}
                  </Typography>
                </Box>
              )}
              {props.buysell == "SELL" && (
                <VersusInput placeholder="Sell Price" value={sellprice} onChange={(e) => { setSellPrice(e.target.value) }} />
              )}
            </Box>
          </Box>
          <Box p={3} display={"flex"} justifyContent={"center"}>
            <VersusButton
              label={"CONFIRM TO " + (props.buysell == "BUY" && props.nft.isOwned ? "CANCEL" : props.buysell)}
              style={{ width: "fit-content" }}
              onClick={() => {
                props.handleClose();
                if (props.buysell == "BUY") {
                  props.buyNft(props.nft.itemId, props.nft.price);
                } else {
                  props.sellNft(
                    props.nft.id,
                    Number(sellprice)
                  );
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

const VersusNFT = (props) => {
  const { uid, address } = useSelector(({ authReducer }) => authReducer.auth);

  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirmOpen = () => setConfirmOpen(true);
  const handleConfirmClose = () => setConfirmOpen(false);

  async function sellNft(tokenID, price) {
    try {
      props.onLoading(true);
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/sendtransaction/v1/SellNFT",
        {
          UserID: uid,
          Account: address,
          tokenId: ethers.BigNumber.from(tokenID).toNumber().toString(),
          price: price,
          nftType: props.collection.collection_type,
          nftContract: props.collection.collection_address,
        }
      );
      console.log("response->", response.data);
      props.onLoading(false);
      props.onSell();
    } catch {
      props.onLoading(false);
      return;
    }
  }

  async function buyNft(itemId, price) {
    try {
      props.onLoading(true);
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/sendtransaction/v1/BuyNFT",
        {
          Account: address,
          price: price,
          itemId: itemId,
          UserID: uid,
          nftType: props.collection.collection_type,
          nftContract: props.collection.collection_address,
        }
      );
      console.log("response->", response.data);
      props.onLoading(false);
      props.onBuy();
    } catch {
      props.onLoading(false);
      return;
    }
  }

  async function cancelNft(itemId) {
    try {
      props.onLoading(true);
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/sendtransaction/v1/CancellNFT",
        {
          UserID: uid,
          Account: address,
          itemId: itemId
        }
      );
      console.log("response->", response.data);
      props.onLoading(false);
      props.onCancel();
    } catch {
      props.onLoading(false);
      return;
    }
  }

  return <>
    <Box sx={{ cursor: "pointer" }}>
      <Box
        p={1}
        sx={{
          color: "white",
          border: "2px solid white",
          borderRadius: "16px",
        }}
        onClick={handleOpen}
      >
        <Box bgcolor="#00BDFF80" borderRadius={"8px"}>
          <img
            src={
              props.nft.thumbnail
                ? props.nft.thumbnail
                : "/imgs/nft-default.png"
            }
            width={"100%"}
            style={{
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          />
          <Box
            p={2}
            bgcolor="#00000066"
            sx={{
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              height: "6.8rem",
              overflow: "hidden"
            }}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography fontWeight={"bold"} variant="subtitle1">
                {props.nft.title}
              </Typography>
              {props.nft.balance > 1 && (
                <Typography fontWeight={"bold"} variant="subtitle1">
                  X {props.nft.balance}
                </Typography>
              )}
            </Box>
            <Typography variant="body2" className="ellipsis">
              {props.nft.description}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        mt={2}
        p={1}
        display={"flex"}
        justifyContent={"center"}
        style={{
          background: `url("/imgs/BUY-MATIC.png")`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        onClick={() => {
          handleConfirmOpen();
        }}
      >
        <Box textAlign={"center"} sx={{ marginBottom: "4px" }}>
          {props.buysell == "BUY" && (
            <>
              <Typography
                fontFamily={"Klapt"}
                variant="caption"
                color="#00BDFF"
              >
                {props.nft.isOwned ? "CANCEL" : "BUY"}
              </Typography>
              <Box display={"flex"} alignItems={"center"}>
                <img src="/imgs/matic-token-icon.png" />
                <Typography
                  fontFamily={"Klapt"}
                  variant="body1"
                  ml={1}
                  color="#00BDFF"
                >
                  {ethers.utils.formatEther(props.nft.price || "0").toString()} MATIC
                </Typography>
              </Box>
            </>
          )}
          {props.buysell == "SELL" && (
            <Typography fontFamily={"Klapt"} variant="body1" color="#00BDFF">
              SELL
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
    <VersusNFTConfirm
      open={confirmOpen}
      handleClose={handleConfirmClose}
      handleOpen={handleConfirmOpen}
      nft={props.nft}
      buysell={props.buysell}
      collection={props.collection}
      buyNft={(itemId, price) => {
        if (props.nft.isOwned) {
          cancelNft(itemId)
        } else {
          buyNft(itemId, price)
        }
      }}
      sellNft={sellNft}
    />
    <VersusNFTDetail
      open={open}
      handleClose={handleClose}
      handleOpen={handleOpen}
      nft={props.nft}
      buysell={props.buysell}
      collection={props.collection}
      buyNft={() => {
        handleConfirmOpen();
        handleClose();
      }}
      sellNft={() => {
        handleConfirmOpen();
        handleClose();
      }}
    />
  </>;
};
export default VersusNFT;
