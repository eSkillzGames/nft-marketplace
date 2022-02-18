import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const sliderThumbStyles = (props) => `
  width: 35px;
  height: 35px;
  background: #11313A;
  border: 4px solid #28bae0;
  opacity:1;
  -webkit-transition: .2s;
  transition: opacity .2s;
  border-radius:50%;
`;

const Styles = styled.div`
  display: flex;
  align-items: center;
  color: #888;
  margin-top: 2rem;

  .value {
    flex: 1;
    font-size: 2rem;
  }

  .slider {
    flex: 6;
    -webkit-appearance: none;
    width: 100%;
    height: 1px;
    border-radius: 15px;
    background: #4F6268;
    outline: none;
    margin: 0px;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      ${(props) => sliderThumbStyles(props)}
    }

    &::-moz-range-thumb {
      ${(props) => sliderThumbStyles(props)}
    }

    :hover::-webkit-slider-thumb {
      border: 2px solid #28bae0;
    }

    :hover::-moz-range-thumb {
      border: 2px solid #28bae0;
    }

    input[type="range"]::-webkit-slider-thumb {
      position: relative;
      top: -5px;
      width: 20px;
      height: 20px;
      border: 1px solid #999;
      -webkit-appearance: none;
      background-color: #fff;
      box-shadow: inset 0 -1px 2px 0 rgba(0, 0, 0, 0.25);
      border-radius: 100%;
      cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
      position: relative;
      top: 0px;
      width: 20px;
      height: 20px;
      border: 1px solid #999;
      -moz-appearance: none;
      background-color: #fff;
      box-shadow: inset 0 -1px 2px 0 rgba(0, 0, 0, 0.25);
      border-radius: 100%;
      cursor: pointer;
    }

    input[type="range"]:active {
      display: block;
      transform: translateX(-50%);
    }
  }
`;

const CustomSlider = (props) => {
    const currentValueRef = useRef(null);
    const nextRef = useRef(null);
    const { getSliderVal} = props;

    const [state, setState] = useState({
        value: 1
    });
    const [currentValue, setCurrentValue] = useState('');
    const updatePosition = () => {
        const { value, min, max } = currentValueRef.current;
        setCurrentValue(value);
        const controlMin = min;
        const controlMax = max;
        const controlThumbWidth = currentValueRef.current.getAttribute(
            "thumbwidth"
        );

        const range = controlMax - controlMin;

        const position = ((value - controlMin) / range) * 100;
        var positionOffset = Math.round(controlThumbWidth * (position / 100));
        setCurrentValue(`calc(${position}% - ${positionOffset}px)`);
        nextRef.current.style.left = `calc(${position}% - ${positionOffset}px)`;
        nextRef.current.style.top = '-5px';
        nextRef.current.style.color = '#28bae0';
        nextRef.current.style.text = value;
    };

    const handleOnChange = (e) => {
        setState({ value: e.target.value });
        updatePosition();
    };

    useEffect(() => {
        updatePosition();
    }, []);
    getSliderVal(state.value)
    return (
        <div className="SlideOuterBx">
            <Styles color={props.color} value={state.value}>
                <div className="slideInpOuter w-100" style={{ position: "relative" }}>
                    <input
                        type="range"
                        step={2}
                        min={1}
                        max={365}
                        step="1"
                        value={state.value}
                        // defaultValue={state.value}
                        className="slider"
                        thumbwidth="35"
                        onChange={handleOnChange}
                        ref={currentValueRef}
                    />
                    <div style={{ border: '2px solid #28bae0', width: currentValue, marginTop: '-0.5rem', position: 'absolute' }}></div>
                    <output name="rangeVal" ref={nextRef}>
                        {state.value}
                    </output>
                </div>
            </Styles>
        </div>
    );
};

export default CustomSlider;
