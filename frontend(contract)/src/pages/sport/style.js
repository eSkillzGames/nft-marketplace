import { createStyles } from '@material-ui/styles';
import theme from '../../theme';

const styles = createStyles({
  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '10% 15%',
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
    height: '750px',
    border: '1px solid #41585F',
    [theme.breakpoints.down('1024')]: {
      height: '0',
      width: 'calc(100% - 48px)',
    },
  },
  circle_btn: {
    position: 'absolute',
    zIndex: '9999',
    top: '50px',
    left: '50px',
    minWidth: 'auto',
    width: '40px',
    height: '40px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    borderRadius: '50%',
    fontFamily: 'monospace',
    fontSize: '24px',
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
    '& > .titles' : {
      display: 'flex',
      flexDirection: 'row',
      '& > div': {
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
          marginLeft:"4px",
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
      }
      
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

  file_upload : {
    width: "calc(50% - 40px)",
    border: "1.5px dashed #41585F",
    display: "flex",
    minHeight: "520px",
    borderRadius: "25px",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#11313A",
    paddingTop: "24px",
    paddingBottom: "24px",
    paddingLeft: "8px",
    paddingRight: "8px",
    '& > div' : {
      position: "relative",
      minWidth: "0",
      padding: "0",
      margin: "0",
      border: "0",
      verticalAlign: "top",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      '& > svg' : {
        userSelect: "none",
        width: "1em",
        height: "1em",
        display: "inline-block",
        fill: "currentColor",
        flexShrink: "0",
        color: "#1976d2",
        fontSize: "40px",
        transition: "fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
      '& > span' : {
        color: "#41585F",
        fontSize: "16px",
        maxWidth: "300px",
        margin: "0",
        fontFamily: "'Roboto','Helvetica','Arial',sans-serif",
        fontWeight: "400",
        lineHeight: "1.66",
        letterSpacing: "0.03333em",
        textAlign: "center",
        paddingTop: "8px",
        paddingBottom: "8px",
      },
      '& > label': {
        padding: "0px",
        '& > span' : {
          color: "#28BAE0",
          width: "220px",
          border: "1px solid #28BAE0",
          filter: "drop-shadow(0px 0px 14px rgba(45, 191, 223, 0.2))",
          height: "52px",
          fontSize: "16px",
          textShadow: "0px 0px 14px rgb(45 191 223 / 20%)",
          borderRadius: "50px",
          backgroundColor: "transparent",
          boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
          padding: "6px 16px",
          minWidth: "64px",
          boxSizing: "border-box",
          transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          fontWeight: "500",
          lineFeight: "1.75",
          letterSpacing: "0.02857em",
          textTransform: "uppercase",
          cursor: "pointer",
          margin: "0",
          display: "inline-flex",
          outline: "0",
          position: "relative",
          alignItems: "center",
          userSelect: "none",
          verticalAlign: "middle",
          justifyContent: "center",
          textDecoration: "none",
        }
      }
      
    },
    '& > ul' : {
      
    }
  },
  modal : {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: "8px",
      backgroundColor: "#11313A",
      padding:"0px",
      border: "none",
      borderRadius: "18px",
      justifyContent: "center",
    },
    overlay: {
        background: "rgba(5, 5, 5, 0.9)",
    }
  },

  presale_btn : {
    color:"#11313A",
    border:"none", 
    margin:"24px", 
    backgroundColor:"#28BAE0",
    height:"40px",
    padding:"8px 16px", 
    borderRadius:"20px",
    textAlign:"center", 
    marginTop:"20px", 
    fontWeight:"bold",
    fontSize:"16px",
    cursor:"pointer",
  },
  
  modal_content: {
    display:"flex",
    flexDirection:"row",
    justifyContent: "center",
    marginTop: "100px",
     
    '& > div': {
      display: "flex",
      flexDirection:"row",
      background: "#11313A",
      borderRadius: "18px",
      '& > .infor1': {
        display:"flex",
        flexDirection:"column", 
        padding:"24px",
        borderRadius:"18px",
        backgroundColor:"#031E26",
        '& > .amount_eth': {
          padding:"6px 12px", 
          color:"#9BA5A9",
        },
        '& > input' : {
          border:"none", 
          padding:"18px 24px", 
          borderRadius:"24px",
          backgroundColor:"#11313A",
          color:"white",
          outlineStyle:"none"
        },
        '& > .token_purchased': {
          padding:"18px 12px 4px 12px", 
          color:"#9BA5A9"
        },
        '& > .value': {
          fontSize:"24px",
          fontWeight:"bold", 
          color:"#28BAE0"
        },
        '& > .buy_btn': {
          backgroundColor:"#28BAE0",
          height:"40px",
          padding:"8px 16px", 
          borderRadius:"20px",
          textAlign:"center", 
          marginTop:"20px", 
          fontWeight:"bold",
          fontSize:"16px",
          cursor:"pointer",
          border: "none",
          transition: "background 0.8s",
          '&:hover': {
            background: "#47a7f5 radial-gradient(circle, transparent 1%, #47a7f5 1%) center/15000%",
          },
          '&:active': {
            backgroundColor: "#6eb9f7",
            backgroundSize: "100%",
            transition: "background 0s",
          },
        }
      },
      '& > .infor2': {
        display:"flex",
        flexDirection:"column",
        padding:"24px",
        
        '& > div': {
          display:"flex",
          flexDirection:"column",
          '& > .title': {
            padding:"4px", 
            color:"#9BA5A9"
          },
          '& > .content': {
            padding:"4px 4px 16px 4px",
            color:"#6BA5A9"
          }
        }
      }
    }
  },

});

export default styles;