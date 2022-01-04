import { createStyles } from '@material-ui/styles';
import theme from '../../theme';

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
  },
  buttons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: '9999',
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
    zIndex: '9999',
    top: '30px',
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