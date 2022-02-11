
import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import styles from './style';

const useStyles = makeStyles(styles);

const getTime = (seconds) => {
  let hrs = Math.floor(seconds / 3600);
  let mins = Math.floor((seconds - hrs * 3600) / 60);
  let secs = seconds - hrs * 3600 - mins * 60;
  if (hrs > 0 && hrs < 10) hrs = '0' + hrs;
  if (mins < 10) mins = '0' + mins;
  if (secs < 10) secs = '0' + secs;
  return hrs ? `${hrs}:${mins}:${secs}` : `${mins}:${secs}`;
}

const Card = (props) => {
  const classes = useStyles();
  const { image, description, token, price, isSelected, ...rest } = props;

  return (
    <div className={`${classes.card} ${price ? classes.token : classes.life} ${isSelected ? classes.selected : ''}`} {...rest}>
      {price && description && <label>Special Offer</label>}
      <img src={`/images/${image}`} alt="" />
      <span className={`${price ? '' : classes.life_description} ${token < 100 ? classes.white_description : ''}`}>{description}</span>
      <p>
        <img src="/images/token1.png" alt="" />
        {price && <span>+</span>}
        {token.toLocaleString()}
      </p>
      {price && <Button>$ {price}</Button>}
    </div>
  )
}

const LifesAndTokens = () => {
  const classes = useStyles();
  const router = useRouter();
  const [selectedLife, setSelectedLife] = React.useState(0);
  const [selectedToken, setSelectedToken] = React.useState(0);
  const [time, setTime] = React.useState(1532);
  const [esgAndSPORTSelected, setESGAndSPORTSelected] = React.useState(0);

  const lifes = [
    {
      image: 'refresh1.png',
      description: 'Refresh +1',
      token: 10,
    },
    {
      image: 'onetime10.png',
      description: 'One time +10',
      token: 20,
    },
    {
      image: 'life1.png',
      description: 'Up to 20 lifes',
      token: 200,
    },
    {
      image: 'life2.png',
      description: 'Up to 30 lifes',
      token: 300,
    },
    {
      image: 'life3.png',
      description: 'Up to 40 lifes',
      token: 400,
    },
  ];

  const tokens = [
    {
      image: 'special.png',
      description: 'Up to 20 lifes',
      token: 2000,
      price: '9.99',
    },
    {
      image: 'token1.png',
      token: 2000,
      price: '4.99',
    },
    {
      image: 'token2.png',
      token: 5000,
      price: '15.99',
    },
    {
      image: 'token3.png',
      token: 10000,
      price: '19.99',
    },
  ];

  React.useEffect(() => {
    setTimeout(() => {
      if (time > 0) setTime(time - 1);
    }, 1000);
  }, [time]);

  return (
    <>
      <div className={classes.hero}>
        <div style={{justifyContent: 'center',marginBottom:"20px"}}>
          <Button className={`${classes.btn1} ${esgAndSPORTSelected === 2 ? classes.selected_btn : ''}`} onClick={() => {setESGAndSPORTSelected(2);router.push('/esg');}}>              
            {"ESG Token sale"}
          </Button>
          <div style={{width:"34px"}}></div>
          <Button className={`${classes.btn2} ${esgAndSPORTSelected === 1 ? classes.selected_btn : ''}`} onClick={() => {setESGAndSPORTSelected(1);router.push('/sport');}}>              
            {"SPORT Token sale"}
          </Button>
        </div>        
        <div>
          <span />
          <div>
            <div>
              <img src="/images/life.png" alt="" />
              <div>
                <p>9/10</p>
                <span>+1 in {getTime(time)}</span>
              </div>
            </div>
            <div>
              <img src="/images/token1.png" alt="" />
              <p>23,450</p>
            </div>
          </div>
          <span />
        </div>
        <p>Lifes</p>
        <div>
          {lifes.map((life, index) => (
            <Card key={index} image={life.image} description={life.description} token={life.token} isSelected={selectedLife === index} onClick={() => setSelectedLife(index)} />
          ))}
        </div>
        <p>Tokens</p>
        <div>
          {tokens.map((token, index) => (
            <Card key={index} image={token.image} description={token.description} token={token.token} price={token.price} isSelected={selectedToken === index} onClick={() => setSelectedToken(index)} />
          ))}
        </div>
      </div>
    </>
  );
}

export default LifesAndTokens;