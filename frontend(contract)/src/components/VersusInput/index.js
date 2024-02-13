import React from "react";
import {
  OutlinedInput,
} from "@mui/material";

const VersusInput = (props) => {
  return (
    <OutlinedInput
      sx={{
        ...props.style,
        // minWidth: "300px",
        borderRadius: "0px",
        color: "white",
        backgroundColor: "#25253080",
        border: "1px solid #00BDFF",
        padding: "0px",
        fontSize:"1rem",
        input: {
          padding: "0.5rem",
          "::placeholder": {
            color: "white",
          },
        },
        fieldset: {
          border: "0px",
        },
        svg: { color: "white" },
      }}
      variant="outlined"
      placeholder={props.placeholder}
      type={props.type}
      value={props.value}
      onChange={props.onChange}
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      startAdornment={props.startAdornment || <></>}
      endAdornment={props.endAdornment || <></>}
      readOnly={props.readOnly}
    />
  );
};
export default VersusInput;
