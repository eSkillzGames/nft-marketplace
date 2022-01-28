import { createStyles } from '@material-ui/styles';
import theme from '../../theme';

const styles = createStyles({
  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '15%',
    [theme.breakpoints.down('1024')]: {
      flexDirection: 'column',
      paddingTop: '130px',
    },
    '& > img': {
      position: 'absolute',
      top: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      [theme.breakpoints.down('1024')]: {
        width: '124px',
      },
    },
    '& > .MuiBox-root': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: 'calc(50% - 40px)',
      minHeight: '520px',
      backgroundColor: '#11313A',
      border: '1.5px dashed #41585F',
      borderRadius: '25px',
      '& .MuiTypography-root': {
        maxWidth: '300px',
        fontSize: '16px',
        color: '#41585F',
      },
      '& .MuiButton-root': {
        width: '220px',
        height: '52px',
        filter: 'drop-shadow(0px 0px 14px rgba(45, 191, 223, 0.2))',
        backgroundColor: 'transparent',
        border: '1px solid #28BAE0',
        borderRadius: '50px',
        fontSize: '16px',
        color: '#28BAE0',
        textShadow: '0px 0px 14px rgba(45, 191, 223, 0.2)',
      },
      [theme.breakpoints.down('1024')]: {
        width: '100%',
        minHeight: '360px',
      },
    },
    '& #submit': {
      width: '220px',
      height: '52px',
      marginTop: '24px',
      backgroundColor: '#28BAE0',
      boxShadow: '0px 0px 14px rgba(45, 191, 223, 0.2)',
      borderRadius: '50px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#11313A',
    },
    '& > #submit': {
      [theme.breakpoints.up('1024')]: {
        display: 'none',
      },
      [theme.breakpoints.down('560')]: {
        width: '100%',
      },
    },
  },
  vertical_line: {
    margin: '26px 40px',
    height: '468px',
    border: '1px solid #41585F',
    [theme.breakpoints.down('1024')]: {
      height: '0',
      width: 'calc(100% - 48px)',
    },
  },
  infos: {
    width: 'calc(50% - 40px)',
    display: 'flex',
    flexDirection: 'column',
    '& > span': {
      fontSize: '14px',
      lineHeight: '16px',
      color: '#9BA5A9',
      margin: '0 0 8px 24px',
    },
    '& > .MuiTextField-root': {
      marginBottom: '24px',
      '& > .MuiInputBase-root': {
        backgroundColor: '#11313A',
        borderRadius: '26px',
        color: 'white',
        '& > *': {
          padding: '18px 24px',
          '&::placeholder': {
            color: '#41585F',
          },
        },
        '&:after': {
          display: 'none',
        },
        '&:before': {
          display: 'none',
        },
      },
      '& > .MuiFilledInput-multiline': {
        padding: '0',
      },
    },
    '& > #toggles': {
      display: 'flex',
      marginBottom: '24px',
      '& > div': {
        display: 'flex',
        flexDirection: 'column',
        '&:first-child': {
          marginRight: '24px',
          [theme.breakpoints.down('560')]: {
            marginBottom: '24px',
          },
        },
        '& > span': {
          fontSize: '14px',
          lineHeight: '16px',
          color: '#9BA5A9',
          margin: '0 0 8px 24px',
        },
        '& > .MuiToggleButtonGroup-root': {
          background: '#11313A',
          borderRadius: '26px',
          padding: '4px',
          '& > .MuiToggleButton-root': {
            width: '120px',
            height: '44px',
            borderRadius: '24px',
            fontSize: '16px',
            fontWeight: 'normal',
            color: '#9BA5A9',
            [theme.breakpoints.down('1024')]: {
              width: '100px',
            },
            [theme.breakpoints.down('560')]: {
              width: '50%',
            },
          },
          '& > .Mui-selected': {
            color: '#11313A',
            fontWeight: '600',
            backgroundColor: '#28BAE0',
          },
        },
        [theme.breakpoints.down('560')]: {
          width: '100%',
        },  
      },
      [theme.breakpoints.down('1024')]: {
        justifyContent: 'space-between',
      },
      [theme.breakpoints.down('560')]: {
        flexDirection: 'column',
      },
    },
    '& > #submit': {
      [theme.breakpoints.down('1024')]: {
        display: 'none',
      },
    },
    [theme.breakpoints.down('1024')]: {
      width: '100%',
    },
  },
  quantity: {
    display: 'flex',
    alignItems: 'center',
    background: '#11313A',
    borderRadius: '26px',
    padding: '8px',
    '& > button': {
      backgroundColor: '#28BAE0',
      minWidth: 'auto',
      width: '36px',
      height: '36px',
      borderRadius: '18px',
      fontSize: '32px',
      fontWeight: 'normal',
    },
    '& > .Mui-disabled': {
      backgroundColor: '#41585F',
    },
    '& > span': {
      margin: '0 32px',
      color: 'white',
      [theme.breakpoints.down('1024')]: {
        margin: '0 16px',
      },
    },
    [theme.breakpoints.down('560')]: {
      justifyContent: 'space-between',
    },
  },
});

export default styles;