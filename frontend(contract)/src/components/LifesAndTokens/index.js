
import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import styles from './style';

const useStyles = makeStyles(styles);

const getTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds - hrs * 3600) / 60);
  const secs = seconds - hrs * 3600 - mins * 60;
  if(hrs > 0 && hrs < 10) hrs = '0' + hrs;
  if(mins < 10) mins = '0' + mins;
  return hrs ? `${hrs}:${mins}:${secs}` : `${mins}:${secs}`;
}

const LifesAndTokens = () => {
  const classes = useStyles();

  const [selected, setSelected] = React.useState(0);
  
  return (
    <>
      <div className={classes.hero}>
        <div>
          <span />
          <div>
            <div>
              <img src="/images/life.png" alt="" />
              <div>
                <p>9/10</p>
                <span>+1 in 25:32</span>
              </div>
            </div>
            <div>
              <img src="/images/token1.png" alt="" />
              <p>23,450</p>
            </div>
          </div>
          <span />
        </div>
      </div>
    </>
  );
}

export default LifesAndTokens;