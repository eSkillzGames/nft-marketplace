import { createStyles } from '@material-ui/styles';
import theme from '../../theme';

const styles = createStyles({
  hero: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
  },
  cue: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    width: '100%',
    marginTop: '8px',
    padding: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
    '& > label': {
      position: 'absolute',
      top: '50%',
      left: '-15px',
      color: '#2DBFDF',
      fontSize: '9px',
      fontWeight: '600',
      textTransform: 'uppercase',
      writingMode: 'vertical-lr',
      transform: 'rotate(180deg) translate(0, 50%)',
    },
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      '&:nth-child(1)': {
        minWidth: '350px',
        justifyContent: 'space-between',
        padding: '10px',
        '& > div': {
          display: 'flex',
          justifyContent: 'space-between',
          '& > h3': {
            margin: '0',
            textTransform: 'uppercase',
            fontSize: '14px',
          },
          '& > div': {
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            '& > p': {
              margin: '0',
              padding: '0 4px 0 12px',
              textTransform: 'uppercase',
              fontSize: '9px',
              fontWeight: '700',
            },
            '& > .MuiLinearProgress-root': {
              width: '30px',
              height: '6px',
              background: '#0F3D4B',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
              '& > .MuiLinearProgress-bar': {
                background: '#2DBFDF',
                borderRadius: '2px',
                boxShadow: '0px 0px 4px #2DBFDF',
              },
            },
            '& > img': {
              width: 'auto',
              height: 'fit-content',
            },
          },
        },
      },
      '&:nth-child(2)': {
        padding: '0 20px',
      },
      '&:nth-child(3)': {
        minWidth: '170px',
        alignItems: 'center',
        justifyContent: 'center',
        '& button': {
          maxHeight: '32px',
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
        '& button#upgrade': {
          width: '100%',
          background: '#2DBFDF',
        },
        '& button#buy': {
          width: '120px',
        },
        '& > div': {
          width: '100%',
          display: 'flex',
          padding: '4px 0',
          '& > button': {
            minWidth: '100px',
          },
          '& > .MuiFormControlLabel-root': {
            maxHeight: '32px',
            margin: '0',
            textTransform: 'uppercase',
            '& > .MuiButtonBase-root': {
              padding: '5px',
            },
            '& > .MuiTypography-root': {
              fontSize: '12px',
              fontWeight: '700',
            },
          },
        },
      },
    },
  },
  power: {
    display: 'flex',
    alignItems: 'center',
    padding: '3px 0',
    '& > div': {
      width: '4px',
      height: '8px',
      marginRight: '1px',
      background: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '1px',
    },
    '& > #active': {
      background: '#2DBFDF',
      boxShadow: '0px 0px 4px #2DBFDF',
    },
    '& > p': {
      margin: '0',
      paddingLeft: '6px',
      fontSize: '9px',
      fontWeight: '700',
      color: '#849297',
      textTransform: 'uppercase',
    },
  },
  selected_cue: {
    background: 'linear-gradient(180deg, rgba(45, 191, 223, 0.2) 0%, #2DBFDF 100%)',
    border: '1px solid #2DBFDF',
  },
});

export default styles;