import React from "react";
import { Button, Menu, Box, MenuItem } from "@mui/material";

const VersusMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setAnchorEl(null);
    if (e.onClick) {
      e.onClick();
    }
  };

  return (
    <Box>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          color: "white",
          fontSize: "1rem",
          ...props.style,
        }}
      >
        {props.value}
        <img src="/imgs/vector.png" style={{ marginLeft: "8px" }} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {props.items.map((e, i) => {
          return (
            <MenuItem
              style={{ textTransform: "uppercase" }}
              onClick={() => {
                handleClose(e);
              }}
              key={i}
            >
              {e.label}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
export default VersusMenu;
