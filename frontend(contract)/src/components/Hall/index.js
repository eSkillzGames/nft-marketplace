
import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import styles from './style';

const useStyles = makeStyles(styles);

const Chalks = () => {
  const classes = useStyles();

  const titles = [
    "Table cloth",
    "Board style",
    "Diamonds",
    "Cloth pattern",
    "Room",
  ];

  const backStyle = "linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), radial-gradient(67.5% 67.5% at 50% 32.5%, rgba(0, 0, 0, 0) 17.19%, rgba(0, 0, 0, 0.3) 100%), ";

  const items = [
    {
      color: '#52DAE9',
      isActive: true,
    },
    {
      color: '#52E9B3',
      isActive: true,
    },
    {
      color: '#8F251E',
      isActive: false,
      price: 50,
    },
    {
      color: '#6FB350',
      isActive: false,
      price: 100,
    },
    {
      color: '#535353',
      isActive: true,
    },
    {
      color: '#EFEFEF',
      isActive: false,
      price: 200,
    },
    {
      color: '#8B52E9',
      isActive: false,
      price: 250,
    },
    {
      color: '#1070FF',
      isActive: false,
      price: 300,
    },
    {
      color: '#9C5F3C',
      isActive: false,
      price: 350,
    },
    {
      color: '#E952BF',
      isActive: false,
      price: 400,
    },
    {
      color: '#3D3D3D',
      isActive: false,
      price: 450,
    },
    {
      color: '#8F251E',
      isActive: false,
      price: 500,
    },
    {
      color: '#6FB350',
      isActive: false,
      price: 550,
    },
    {
      color: '#EFEFEF',
      isActive: false,
      price: 200,
    },
    {
      color: '#8B52E9',
      isActive: false,
      price: 250,
    },
    {
      color: '#1070FF',
      isActive: false,
      price: 300,
    },
    {
      color: '#9C5F3C',
      isActive: false,
      price: 350,
    },
    {
      color: '#E952BF',
      isActive: false,
      price: 400,
    },
    {
      color: '#3D3D3D',
      isActive: false,
      price: 450,
    },
    {
      color: '#8F251E',
      isActive: false,
      price: 500,
    },
    {
      color: '#6FB350',
      isActive: false,
      price: 550,
    },
  ];

  const [selected, setSelected] = React.useState(0);
  const [selectedItem, setSelectedItem] = React.useState(0);
  
  return (
    <>
      <div className={classes.hero}>
        <img src="/images/bg.png" alt="" />
        <div>
          <div className={classes.buttons}>
            {titles.map((title, index) => (
              <Button key={index} className={`${classes.btn} ${selected === index ? classes.selected_btn : ''}`} onClick={() => setSelected(index)}>
                {title}
              </Button>
            ))}
          </div>
          <div>
            {items.map((item, index) => (
              <div key={index}>
                <div style={{background: backStyle + item.color, borderColor: index === selectedItem ? 'white' : '', borderWidth: index === selectedItem ? '2px' : ''}} onClick={() => setSelectedItem(index)} />
                {!item.isActive && (
                  <Button>
                    <img src="/images/token.png" alt="" />
                    {item.price}
                  </Button>
                )}
                {!item.isActive && (
                  <img src="/images/lock.png" alt="" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Chalks;