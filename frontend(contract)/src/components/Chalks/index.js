
import React from 'react';
import { Button, FormControlLabel, Checkbox, LinearProgress, makeStyles } from '@material-ui/core';
import styles from './style';

const useStyles = makeStyles(styles);

const Chalk = (props) => {
  const classes = useStyles();

  const { image, shots, shotLine, totalExp, currentExp, isActive, price, isAuto, isSelected, ...rest } = props;

  return (
    <div className={`${classes.chalk} ${isSelected ? classes.selected_chalk : ''}`} {...rest}>
      {isSelected && <label>SELECTED</label>}
      <img src={`/images/${image}`} alt="" />
      <div>
        <img src="/images/shots.png" alt="" />
        <p>
          <span>{shots}</span> SHOTS
        </p>
      </div>
      <div>
        <img src="/images/shot_line.png" alt="" />
        <p>
          +<span>{shotLine}</span>% SHOT LINE
        </p>
      </div>
      {isActive && (
        <div>
          <LinearProgress variant="determinate" value={100*currentExp/totalExp} />
          <label>{currentExp}/{totalExp}</label>
        </div>
      )}
      <div>
        {isActive ? (
          <div>
            <Button>
              <img src="/images/token.png" alt="" />
              <span>{price}</span>
            </Button>
            <FormControlLabel control={<Checkbox checked={isAuto} style={{color: isAuto ? 'white' : 'grey'}} />} label="Auto" />
          </div>
        ) : (
          <Button id="buy">
            Buy
            <img src="/images/token.png" alt="" />
            <span>{price}</span>
          </Button>
        )}
      </div>
    </div>
  )
}

const Chalks = () => {
  const classes = useStyles();

  const data = [
    {
      image: 'chalk1.png',
      shots: 4,
      shotLine: 5,
      totalExp: 4,
      currentExp: 3,
      price: 50,
      isActive: true,
      isAuto: true,
    },
    {
      image: 'chalk2.png',
      shots: 6,
      shotLine: 10,
      totalExp: 6,
      currentExp: 6,
      price: 50,
      isActive: true,
      isAuto: false,
    },
    {
      image: 'chalk3.png',
      shots: 8,
      shotLine: 5,
      totalExp: 8,
      currentExp: 8,
      price: 80,
      isActive: true,
      isAuto: false,
    },
    {
      image: 'chalk1.png',
      shots: 8,
      shotLine: 10,
      price: 1000,
      isActive: false,
    },
    {
      image: 'chalk1.png',
      shots: 8,
      shotLine: 10,
      price: 1000,
      isActive: false,
    },
    {
      image: 'chalk1.png',
      shots: 8,
      shotLine: 10,
      price: 1000,
      isActive: false,
    },
    {
      image: 'chalk1.png',
      shots: 8,
      shotLine: 10,
      price: 1000,
      isActive: false,
    },
    {
      image: 'chalk1.png',
      shots: 8,
      shotLine: 10,
      price: 1000,
      isActive: false,
    },
  ];

  const [selected, setSelected] = React.useState(0);
  
  return (
    <>
      <div className={classes.hero}>
        {data.map((chalk, index) => (
          <Chalk 
            key={index}
            image={chalk.image}
            shots={chalk.shots}
            shotLine={chalk.shotLine}
            totalExp={chalk.totalExp}
            currentExp={chalk.currentExp}
            price={chalk.price}
            isActive={chalk.isActive}
            isAuto={chalk.isAuto}
            isSelected={selected === index}
            onClick={() => setSelected(index)}
          />
        ))}
      </div>
    </>
  );
}

export default Chalks;