import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PhoneIcon from "@mui/icons-material/Phone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import { Box, Button, Grid, styled, Typography } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import Deposit from "../deposit";
import Withdraw from "../withdraw";
import token from "../../../assets/image/State=Default, Type=Minus.png";
import { useState } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const TokenButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  // background: theme.palette.primary.main,
}));

export default function WalletTab(props) {
  const { metaMaskAddress, provider} = props;
  const [value, setValue] = React.useState(0);
  const [selectedBtn, setSelectedBtn] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // if(selectedBtn == 0 && newValue == 1){
    //   setSelectedBtn(1);
    // }
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Tabs
          value={value}
          // indicatorColor="warning"
          onChange={handleChange}
          aria-label="icon label tabs example"
        >
          <Tab
            sx={{ textTransform: "capitalize" }}
            icon={
              <AccountBalanceOutlinedIcon
                color={value !== 0 ? "primary" : "warning"}
              />
            }
            label={
              <Typography
                variant="h6"
                color={value !== 0 ? "primary" : "warning"}
              >
                Deposit
              </Typography>
            }
            {...a11yProps(0)}
          />
          <Tab
            sx={{ textTransform: "capitalize" }}
            icon={
              <AccountBalanceWalletOutlinedIcon
                color={value !== 1 ? "primary" : "warning"}
              />
            }
            label={
              <Typography
                color={value !== 1 ? "primary" : "warning"}
                variant="h6"
              >
                Withdraw
              </Typography>
            }
            {...a11yProps(1)}
          />
          {/* <Tab icon={<PersonPinIcon />} label="NEARBY" /> */}
        </Tabs>
      </Grid>
      <Grid container justifyContent="space-around" sx={{ mt: 4 }}>
        {["MATIC", "SKILL"].map((item, index) => (
          <Grid item key={index}>
            <TokenButton
              // key={index}
              variant={selectedBtn == index ? "contained" : "outlined"}
              // disabled = {item == "MATIC" && value == 1}
              onClick={() => setSelectedBtn(index)}
              color="info"
              startIcon={<img src={token} width="20px" alt="token" />}
            >
              {item}
            </TokenButton>
          </Grid>
        ))}
      </Grid>
      <TabPanel value={value} index={0}>
        <Deposit selected = {selectedBtn} metaMaskAddress = {metaMaskAddress} provider = {provider}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Withdraw selected = {selectedBtn}/>
      </TabPanel>
    </>
  );
}
