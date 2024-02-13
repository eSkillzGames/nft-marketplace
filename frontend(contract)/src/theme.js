// import { createTheme } from '@material-ui/core/styles';
// import { red } from '@material-ui/core/colors';
import { createTheme } from "@mui/material";
import { blueGrey, grey, red, teal } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    // primary: {
    //   main: "#556cd6",
    // },
    // secondary: {
    //   main: "#19857b",
    // },
    error: {
      main: red.A400,
    },
    warning: {
      main: grey[100],
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: blueGrey[800],
          padding: 18,
          borderRadius: 16,
          zIndex: 2000,
        },
        // backgroundColor:''
      },
    },
  },
  typography: {
    fontFamily: `"Poppins"`,
    fontWeightLight: "100",
    fontWeightRegular: "400",
    fontWeightBold: "700",
    color: "white",
    // h5: {
    //   color: "white",
    //   fontSize: "1.5rem",
    //   fontWeight: 600,
    // },
    // h6: {
    //   color: "white",
    //   fontSize: "1.25rem",
    //   fontWeight: 400,
    // },
    // body2: {
    //   color: "white",
    //   fontSize: "1rem",
    // },
    // caption: {
    //   color: grey[400],
    //   fontSize: "1rem",
    // },
  },
});

export default theme;
