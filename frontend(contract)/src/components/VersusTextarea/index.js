import React from "react";
import {
  OutlinedInput,
} from "@mui/material";

const VersusTextarea = (props) => {
  return (
    <OutlinedInput
      sx={{
        borderRadius: "0px",
        color: "white",
        backgroundColor: "#25253080",
        border: "1px solid #00BDFF",
        padding: "0px",
        width: "100%",
        height:"100%",
        textarea: {
          padding: "10px",
          "::placeholder": {
            color: "white",
          },
        },
        fieldset: {
          border: "0px",
        },
        svg: { color: "white" },
      }}
      multiline={true}
      rows={4}
      variant="outlined"
      placeholder={props.placeholder}
      type={props.type}
      value={props.value}
      onChange={props.onChange}
    />
  );
};
export default VersusTextarea;
