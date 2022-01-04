import { createStyles } from '@material-ui/styles';
import theme from '../../theme';

const styles = createStyles({
  hero: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    top: '-70px',
    '& > img': {
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      transform: 'translateX(-120px)',
    },
    '& > div': {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      position: 'absolute',
      bottom: '0',
      paddingBottom: '40px',
      '& > div:last-child': {
        display: 'flex',
        paddingTop: '10px',
        overflowX: 'scroll',
        scrollbarWidth: 'auto',
        '& > div': {
          position: 'relative',
          textAlign: 'center',
          '&:not(&:last-child)': {
            marginRight: '12px',

          },
          '& > div': {
            width: '60px',
            height: '60px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            cursor: 'pointer',
          },
          '& > button': {
            maxHeight: '28px',
            minWidth: 'auto',
            maxWidth: '55px',
            transform: 'translateY(-20px)',
            background: 'linear-gradient(180deg, rgba(45, 191, 223, 0.85) 0%, rgba(45, 191, 223, 0.425) 100%)',
            border: '1px solid #2DBFDF',
            borderRadius: '6px',
            color: 'white',
            '& img': {
              margin: '0 2px 2px 4px',
            },
            '& > span > span': {
              color: '#FFE072',
            },
          },
          '& > img': {
            position: 'absolute',
            top: '20px',
            left: '25px',
          },
        },
      },
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
    width: '19%',
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
});

export default styles;