import { Grid, Typography ,IconButton} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React from "react";
import WalletTab from "./WalletTab";
import { useDispatch, useSelector } from "react-redux";
import * as fuseActions from "../../store/actions";

const WalletModal = (props) => {
  const { metaMaskAddress, provider} = props;
  const { address } = useSelector(({ authReducer }) => authReducer.auth);
  const dispatch = useDispatch();
  const copy = async () => {
    dispatch(
      fuseActions.showMessage({
        message: "Eskillz Walllet Address Copied.",
        variant: "success",
        timer:3000
      })
    );
    await navigator.clipboard.writeText(address);
  };
  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Wallet 
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
        Eskillz Address : &nbsp;
        <span style={{ color: "lightgreen" }}>
          {address.substr(0, 8)}
        </span>
        <span>{address.substr(8, 8)}</span>
        <span>{"..."}</span>
        <span>{address.substr(address.length - 13, 8)}</span>
        <span style={{ color: "lightgreen" }}>{address.substr(-5)}</span>
        <IconButton onClick={copy}>
          <ContentCopyIcon color="secondary" />
        </IconButton>
      </Typography>
      <WalletTab metaMaskAddress = {metaMaskAddress} provider = {provider}/>
    </div>
  );
};

export default WalletModal;
