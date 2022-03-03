import { createStyles } from '@material-ui/styles';
import theme from '../../theme';

const styles = createStyles({
  hero: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: '25px',
  },
  chalk: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    width: '24%',
    padding: '16px',
    marginBottom: '8px',
    '& > label': {
      position: 'absolute',
      top: '5px',
      left: '10px',
      fontSize: '9px',
      fontWeight: '700',
      lineHeight: '16px',
      color: '#2DBFDF',
    },
    '& > img': {
      margin: '6px auto',
    },
    '& > div': {
      width: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '8px',
      '& > img': {
        height: 'auto',
      },
      '& > p': {
        margin: '0',
        paddingLeft: '4px',
        fontSize: '9px',
        fontWeight: '700',
        color: '#2DBFDF',
        '& > span': {
          color: 'white',
        },
      },
      '& > .MuiLinearProgress-root': {
        width: '100%',
        height: '16px',
        margin: '6px 0 12px',
        background: '#0F3D4B',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        '& > .MuiLinearProgress-bar': {
          background: '#2DBFDF',
          borderRadius: '4px',
          boxShadow: '0px 0px 4px #2DBFDF',
        },
      },
      '& > label': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate( -50%, -50% )',
        fontSize: '9px',
        fontWeight: '700',
        lineHeight: '1',
        color: 'white',
      },
      '& > div': {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        '& > button': {
          width: '50%',
        },
        '& > .MuiFormControlLabel-root': {
          maxHeight: '28px',
          margin: '0',
          textTransform: 'uppercase',
          color: 'white',
          '& > .MuiButtonBase-root': {
            padding: '5px',
          },
          '& > .MuiTypography-root': {
            fontSize: '12px',
            fontWeight: '700',
          },
        },
      },
      '& button': {
        maxHeight: '28px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        color: 'white',
        '& img': {
          margin: '0 2px 2px 4px',
        },
        '& > span > span': {
          color: '#FFE072',
        },
      },
      '& > button': {
        height: '36px',
        maxHeight: 'none',
        width: '100%',
      },
    },
  },
  selected_chalk: {
    background: 'linear-gradient(180deg, rgba(45, 191, 223, 0.2) 0%, #2DBFDF 100%)',
    border: '1px solid #2DBFDF',
  },
});

export default styles;