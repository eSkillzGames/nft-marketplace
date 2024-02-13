import React from "react";
import { Typography } from "@mui/material";

const VersusButton = (props) => {
  return (
    <div
      style={{
        cursor: props.disabled ? "not-allowed" : "pointer",
        background: props.disabled ? "gray" : "linear-gradient(0deg, #009dd0, #0089b7)",
        padding: "2px",
        borderRadius: "4px",
        ...props.style
      }}
      onClick={props.onClick}
    >
      <div
        style={{
          background: props.disabled ? "gray" : props.outline ? "#052737" : "linear-gradient(180deg, #00BDFF, #005067)",
          padding: "0.5rem 0.8rem",
          borderRadius: "2px",
          textAlign: "center"
        }}
      >
        <Typography color="white" fontSize="1rem">{props.label}</Typography>
      </div>
    </div>
  );
};
export default VersusButton;
