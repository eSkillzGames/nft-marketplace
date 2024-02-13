import { useState, useEffect } from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";

const SliderButton = (props) => {
    const sliderValue = props.value;
    const percents = [0, 0.25, 0.5, 0.75, 1];
    const setValueFunc = props.setValue;
    const ButtonClicked = () => {
        console.log("button clicked")
        props.setActiveBtn(props.index);
        setValueFunc(percents[props.index]);
    }

    return (
        <Box
          sx={{
            border: "2px solid #fff",
            borderRadius: "3px",
            width: props.activeBtn === props.index ? 17: 10,
            height: props.activeBtn === props.index ? 17: 10,
            backgroundColor: "rgb(21, 52, 82)",
            transform: "translateX(-50%) translateY(0%) rotate(45deg)",
            position: "absolute",
            left: `${props.value}%`,
            cursor: "pointer"
          }}
          onClick={(e) => {ButtonClicked()}}
        />

    )
}

const VersusSlider = (props) => {
  const [activeBtn, setActiveBtn] = useState(0);
  const steps = [0, 25, 50, 75, 100]; 

  const baseLineClicked = (e) => {
    const value = Math.round((e.clientX -  e.target.getBoundingClientRect().left) / e.target.offsetWidth * 4);
    setActiveBtn(value);
    console.log(e.clientX -  e.target.getBoundingClientRect().left ,  e.target.offsetWidth, value);
  }

  return (
      <Box style={{width: "240px", position:"relative", display:"flex", alignItems:"center", margin:"2rem 0"}}>
         <Box style={{width:"100%", height:"4px", background:"#fff", position:"absolute", top:"-2px",left:"0"}} onClick={baseLineClicked}>
         </Box>
        {steps.map((value, index) => {
            return (
                <SliderButton value={value} key={index} index={index} activeBtn={activeBtn} setActiveBtn={setActiveBtn} setValue={props.setValue}/>
            )
        })}
      </Box>
  )
}

export default VersusSlider;