import React from "react";
import { Box, Typography, Button } from "@mui/material";
import MediaQuery from 'react-responsive';
import { useMediaQuery } from 'react-responsive';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Arrow from '../../components/Arrow';
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";

const Footer = (props) => {
  const navigate = useNavigate();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 576px)' });
  const socialIcon = { margin: "0rem", width: "2.5rem" };

  const [openedTab, setOpenedTab] = React.useState("");
  const [tabOpened, setTabOpened] = React.useState(false);

  React.useEffect(() => {
    console.log("tab opened ", tabOpened, "opened tab ", openedTab )
  }, [tabOpened, openedTab]);
  
  return (
    <Box>
      <Box
        component="div"
        textAlign={"center"}
        style={{ position: "relative", color: "white", padding: "24px", background: "url(/imgs/bg-socials.png)", backgroundSize: "cover" }}
      >
        <Box
          component={"div"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          flexWrap={"wrap"}
        >
          <Typography fontFamily={"Klapt"} fontWeight={"bold"} fontSize={"1.5rem"} color="#00bdff" padding={"0 10px"} marginBottom={"5px"}>STAY CONNECTED</Typography>
          <Box
            component={"div"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Link sx={{minWidth: "auto", margin: "0 5px"}} href="https://discord.gg/versus-x">
              <img
              src="/imgs/discord.png"
              style={socialIcon}
              />
            </Link>
            <Link sx={{minWidth: "auto", margin: "0 5px"}} href="https://twitter.com/PlayVersus_X">
              <img
                src="/imgs/twitter.png"
                style={socialIcon}
              />
            </Link>
            <Link sx={{minWidth: "auto", margin: "0 5px"}} href="https://www.linkedin.com/company/eskillzgames">
              <img
                src="/imgs/linkedin.png"
                style={socialIcon}
              />
            </Link>
            <Link sx={{minWidth: "auto", margin: "0 5px"}} href="https://www.youtube.com/@Versus-X">
              <img
                src="/imgs/youtube.png"
                style={socialIcon}
              />
            </Link>
            <Link sx={{minWidth: "auto", margin: "0 5px"}} href="https://medium.com/@Versus-X">
              <img
                src="/imgs/medium.png"
                style={socialIcon}
              />
            </Link>
          </Box>
        </Box>
      </Box>

      {isTabletOrMobile ? 
      <Box padding="1rem">
        <Box marginBottom={"2rem"}>
          <ListItemButton onClick={() => {
              if(!tabOpened){
                setTabOpened(true);
                setOpenedTab("project");
              }
              else if(tabOpened && openedTab === "project"){
                setTabOpened(false);
              }
              else {
                setOpenedTab("project");
              }
            }} sx={{color: "white"}}>
            <ListItemText primary="THE PROJECT" />
            {openedTab === "project" && tabOpened ? <Arrow open="1"/>: <Arrow open="0"/>}
          </ListItemButton>
          <Divider sx={{ borderWidth: "1px", borderColor: "#02B1EF", margin: "0 1rem" }} />
          <Collapse in={openedTab === "project" && tabOpened } timeout="auto" unmountOnExit sx={{color: "white"}}>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.eskillz.io/golf/" sx={{color: "white"}}>GAME</Link>
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.eskillz.io/pool/" sx={{color: "white"}}>LORE</Link>
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.eskillz.io/pool/" sx={{color: "white"}}>ROADMAP</Link>
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton onClick={() => {
              if(!tabOpened){
                setTabOpened(true);
                setOpenedTab("navigation");
              }
              else if(tabOpened && openedTab === "navigation"){
                setTabOpened(false);
              }
              else {
                setOpenedTab("navigation");
              }
            }} sx={{color: "white"}}>
            <ListItemText primary="NAVIGATION" />
            {openedTab === "navigation" && tabOpened ? <Arrow open="1"/>: <Arrow open="0"/>}
          </ListItemButton>
          <Divider sx={{ borderWidth: "1px", borderColor: "#02B1EF", margin: "0 1rem" }} />
          <Collapse in={openedTab === "navigation" && tabOpened } timeout="auto" unmountOnExit sx={{color: "white"}}>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.eskillz.io/" sx={{color: "white"}}>HOME</Link>
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.eskillz.io/" sx={{color: "white"}}>ARTICLE</Link>
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.eskillz.io/" sx={{color: "white"}}>COMMUNITY</Link>
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton onClick={() => {
              if(!tabOpened){
                setTabOpened(true);
                setOpenedTab("aboutUs");
              }
              else if(tabOpened && openedTab === "aboutUs"){
                setTabOpened(false);
              }
              else {
                setOpenedTab("aboutUs");
              }
            }} sx={{color: "white"}}>
            <ListItemText primary="ABOUT US" />
            {openedTab === "aboutUs" && tabOpened ? <Arrow open="1"/>: <Arrow open="0"/>}
          </ListItemButton>
          <Divider sx={{ borderWidth: "1px", borderColor: "#02B1EF", margin: "0 1rem" }} />
          <Collapse in={openedTab === "aboutUs" && tabOpened } timeout="auto" unmountOnExit sx={{color: "white"}}>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.eskillz.io/" sx={{color: "white"}}>STUDIO</Link>
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.eskillz.io/eskillz-team/" sx={{color: "white"}}>TEAM</Link>
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.eskillz.io/" sx={{color: "white"}}>PARTNERS</Link>
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton onClick={() => {
              if(!tabOpened){
                setTabOpened(true);
                setOpenedTab("resources");
              }
              else if(tabOpened && openedTab === "resources"){
                setTabOpened(false);
              }
              else {
                setOpenedTab("resources");
              }
            }} sx={{color: "white"}}>
            <ListItemText primary="RESOURCES" />
            {openedTab === "resources" && tabOpened ? <Arrow open="1"/>: <Arrow open="0"/>}
          </ListItemButton>
          <Divider sx={{ borderWidth: "1px", borderColor: "#02B1EF", margin: "0 1rem" }} />
          <Collapse in={openedTab === "resources" && tabOpened } timeout="auto" unmountOnExit sx={{color: "white"}}>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://eskillzgamesuk.gitbook.io/eskillz/" sx={{color: "white"}}>WHITE PAPER</Link>
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.dropbox.com/sh/3qr4jnn81qvs86i/AACQ7cQzFmcrzJT-CrOTD54ja?dl=0" sx={{color: "white"}}>MEDIA KIT</Link>
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <Link href="https://www.eskillz.io/wp-content/uploads/2023/03/Litepaper3103.pdf" sx={{color: "white"}}>LITE PAPER</Link>
              </ListItemButton>
            </List>
          </Collapse>
        </Box>

        <Box display={"flex"} justifyContent={"space-between"} padding={"0 1rem"} marginBottom={"3rem"}>
            <img src="/imgs/google_pay.png" height="30px" />
            <img src="/imgs/apple_store.png" height="30px" />
            <img src="/imgs/token_price.png" height="30px" />
        </Box>

        <Box
            component={"div"}
            marginBottom={"1rem"}
            padding={"1rem"}
          >
          <img src="/imgs/versusx-logo.png" width={"120px"} />
          <Typography variant="body1" color="white" fontSize={"12px"}>
              Versus-X Game. Copyright © 2023 All rights reserved.
            </Typography>
        </Box>
      </Box>
      :
      <Box
        component={"div"}
        p={4}
        bgcolor="#0C0C11"
        mt={3}
        display={"flex"}
        justifyContent={"center"}
      >
        <Box component={"div"} width={"800px"}>
          <Box
            component={"div"}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Box>
              <div style={{ marginBottom: "10px" }}>
                <Typography variant="body1" color="white" fontFamily={"Klapt"} fontWeight={"bold"}>
                  THE PROJECT
                </Typography>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <Link href="https://www.eskillz.io/golf/" sx={{color: "white"}}>GAME</Link>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <Link href="https://www.eskillz.io/pool/" sx={{color: "white"}}>LORE</Link>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <Link href="https://www.eskillz.io/pool/" sx={{color: "white"}}>ROADMAP</Link>
              </div>
            </Box>
            <Box>
              <div style={{ marginBottom: "10px" }}>
                <Typography variant="body1" color="white" fontFamily={"Klapt"} fontWeight={"bold"}>
                  NAVIGATION
                </Typography>
              </div>
              <div style={{ marginTop: "8px" }}>
                <div style={{ marginBottom: "5px" }}>
                  <Link href="https://www.eskillz.io/" sx={{color: "white"}}>HOME</Link>
                </div>
              </div>
              <div>
                <div style={{ marginBottom: "5px" }}>
                  <Link href="https://www.eskillz.io/" sx={{color: "white"}}>ARTICLE</Link>
                </div>
              </div>
              <div>
                <div style={{ marginBottom: "5px" }}>
                  <Link href="https://www.eskillz.io/" sx={{color: "white"}}>COMMUNITY</Link>
                </div>
              </div>
            </Box>
            <Box>
              <div style={{ marginBottom: "10px" }}>
                <Typography variant="body1" color="white" fontFamily={"Klapt"} fontWeight={"bold"}>
                  ABOUT US
                </Typography>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <Link href="https://www.eskillz.io/" sx={{color: "white"}}>STUDIO</Link>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <Link href="https://www.eskillz.io/eskillz-team/" sx={{color: "white"}}>TEAM</Link>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <Link href="https://www.eskillz.io/" sx={{color: "white"}}>PARTNERS</Link>
              </div>
            </Box>
            <Box>
              <div style={{ marginBottom: "10px" }}>
                <Typography variant="body1" color="white" fontFamily={"Klapt"} fontWeight={"bold"}>
                  RESOURCES
                </Typography>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <Link href="https://eskillzgamesuk.gitbook.io/eskillz/" sx={{color: "white"}}>WHITE PAPER</Link>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <Link href="https://www.dropbox.com/sh/3qr4jnn81qvs86i/AACQ7cQzFmcrzJT-CrOTD54ja?dl=0" sx={{color: "white"}}>MEDIA KIT</Link>
              </div>
              <div style={{ marginBottom: "5px" }}>
                <Link href="https://www.eskillz.io/wp-content/uploads/2023/03/Litepaper3103.pdf" sx={{color: "white"}}>LITE PAPER</Link>
              </div>
            </Box>

            <Box>
              <div>
                <img src="/imgs/google_pay.png" height="30px" />
              </div>
              <div style={{ marginTop: "6px" }}>
                <img src="/imgs/apple_store.png" height="30px" />
              </div>
              <div style={{ marginTop: "6px" }}>
                <img src="/imgs/token_price.png" height="30px" />
              </div>
            </Box>
          </Box>
          <Box
            component={"div"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={5}
          >
            <img src="/imgs/versusx-logo.png" width={"120px"} />
            <Typography variant="body1" color="white" fontSize={"14px"}>
              Versus-X Game. Copyright © 2023 All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
      } 
    </Box>
  );
};
export default Footer;
