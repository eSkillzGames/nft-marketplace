import { createStyles } from '@material-ui/styles';
import theme from '../../theme';

const styles = createStyles({
  hero: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '36px 0 48px',
    '& > div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      '&:first-child': {
        '& > span': {
          width: '30%',
          border: '1px solid #0F3D4B',
        },
        '& > div': {
          width: '40%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          color: 'white',
          '& > div': {
            display: 'flex',
            alignItems: 'center',
            '& > img': {
              width: '24px',
              marginRight: '8px',
            },
            '& p': {
              margin: '0',
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '1',
            },
            '& > div': {
              display: 'flex',
              flexDirection: 'column',
              '& > span': {
                fontSize: '9px',
                fontWeight: '600',
                color: '#849297',
              },
            },
          },
        },
      },
    },
    '& > p': {
      margin: '24px 0 12px',
      fontSize: '9px',
      fontWeight: '600',
      color: '#849297',
      textTransform: 'uppercase',
    },
  },
  card: {
    background: 'linear-gradient(180deg, rgba(15, 61, 75, 0.3) 0%, #0F3D4B 100%)',
    border: '1px solid #0F3D4B',
    borderRadius: '8px',
    padding: '24px 14px 12px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    '& > img': {
      width: 'fit-content',
      marginBottom: '15px',
    },
    '& > span': {
      fontSize: '12px',
      fontWeight: '700',
      lineHeight: '2',
      color: '#FFE072',
      textTransform: 'uppercase',
    },
    '& > p': {
      display: 'flex',
      alignItems: 'center',
      margin: '0',
      fontSize: '16px',
      fontWeight: '700',
      lineHeight: '1',
      color: '#FFE072',
      '& > img': {
        height: '16px',
        margin: '0 4px 2px 0',
      },
      '& > span': {
        paddingRight: '4px',
      },
    },
    '& > button': {
      width: '100%',
      marginTop: '20px',
      backgroundColor: '#3D616C',
      fontSize: '18px',
      color: 'white',
    },
    '& > label': {
      fontSize: '9px',
      fontWeight: '600',
      color: '#2DBFDF',
      textTransform: 'uppercase',
      position: 'absolute',
      top: '5px',
      left: '10px',
    },
  },
  selected: {
    background: 'linear-gradient(180deg, rgba(45, 191, 223, 0.2) 0%, #2DBFDF 100%)',
    border: '1px solid #2DBFDF',
  },
  life: {
    width: '19%',
  },
  token: {
    width: '24%',
  },
  white_description: {
    color: 'white !important',
  },
  life_description: {
    padding: '4px 0',
  },
});

export default styles;