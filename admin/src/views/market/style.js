import { createStyles } from '@material-ui/styles';
import theme from './theme';

const styles = createStyles({
  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    padding: '30px 120px 0px',
    [theme.breakpoints.down('768')]: {
      backgroundPosition: '38%',
    },

    [theme.breakpoints.down('600')]: {
      marginTop: '40px',
      padding: '10px 20px',
      alignItems: 'inherit !important',
      display: 'block !important',

      '& > $circle_btn': {
        position: 'initial !important',
        display: 'inline-flex !important',
      },

      '& > $buttons': {
        display: 'inline-block !important',
        width: 'calc(100vw - 90px)',
        padding: '0px',
        marginLeft: '10px',

        '& > button': {
          width: 'calc(50% - 2px) !important',
          margin: '1px',
        }
      },
    }
  },
  buttons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    // zIndex: '9999',
    '& > img': {
      position: 'absolute',
      left: '50px',
      borderRadius: '10px',
    },
    [theme.breakpoints.down('600')]: {
      display: 'block !important',
      padding: '10px',
      marginTop: '0px !important',

      '& > div': {
        display: 'block !important',
        textAlign: 'center',
        marginTop: '10px',

        '& > span': {
          display: 'block !important',
        }
      },

      '& > .seperator': {
        display: 'none !important',
      },

      '& > button': {
        display: 'inline-flex !important',
        width: '33% !important',
      },

      '& > $circle_btn': {
        width: '40px !important',
        top: '125px',
        left: 'calc(100vw - 60px) !important',
        marginLeft: '0px !important',
        position: 'absolute !important',
      }
    },
  },
  btn: {
    width: '24%',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'white',
    '& img': {
      margin: '0 8px 4px 0',
    },
  },
  selected_btn: {
    background: 'linear-gradient(180deg, rgba(45, 191, 223, 0.2) 0%, #2DBFDF 100%)',
    border: '1px solid #2DBFDF',
  },
  circle_btn: {
    position: 'absolute',
    // zIndex: '9999',
    // top: '30px',
    left: '40px',
    minWidth: 'auto',
    width: '40px',
    height: '40px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    borderRadius: '50%',
    fontFamily: 'monospace',
    fontSize: '24px',
  },
});

export default styles;