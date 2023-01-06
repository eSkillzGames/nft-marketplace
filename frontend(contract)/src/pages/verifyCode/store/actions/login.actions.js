import axios from "axios";
import { signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";
import * as fuseActions from "../../../../store/actions";
import * as layoutActions from "../../../../layout/store/actions"
export const REGISTER = "REGISTER";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const register = (nave, email, password, userName, value, file, storageRef,firebase) => async (dispatch) => {
  
  try {
    const res = await axios.post("/api/user/signup", { email, password, userName,value});
    console.log("response0==", res.data);
    if(file){
      
      var uploadTask = storageRef.child(`users/${res.data.userResponse.uid}.jpeg`).put(file);
      uploadTask.on('state_changed', 
        (snapshot) => {        
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');        
        }, 
        (error) => {        
        }, 
        () => {       
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
        }
      );
    }
    dispatch(
      fuseActions.showMessage({
        message: "You have successfully registered and you can login now.",
        variant: "success",
        timer:5000
      })
    );
    nave("/");
    // localStorage.setItem("@uid", res.data.userResponse.uid);
    // localStorage.setItem("address", res.data.address);
    // localStorage.setItem("mail", email);
    // dispatch({
    //   type: REGISTER,
    //   payload: { address: res.data.address, uid: res.data.userResponse.uid , mail : email},
    // });
    // nave("/home");
  } catch (error) {
    console.log("error==", error.message);
    dispatch(
      fuseActions.showMessage({
        message: "You can not registered. Cause of you are registered already.",
        variant: "error",
        timer:5000
      })
    );
  }
};

export const login = (nave, auth, email, password) => async (dispatch) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("user==", user);
      const response = await axios.post(
        "https://eskillzserver.net/sendtransaction/v1/getEskillzAccount",
        { UserID: user.uid }
      );
      if(response.data == "Wallet Address does not exist now."){
        const response_create = await axios.post(
          "https://eskillzserver.net/sendtransaction/v1/CreateEskillzAccount",
          { UserID: user.uid ,userName:"Nothing"}
        );
        console.log("reponse==", response_create);
        localStorage.setItem("@uid", user.uid);
        localStorage.setItem("address", response_create.data);
        localStorage.setItem("mail", email);
        dispatch({
          type: LOGIN,
          payload: { address: response.data, uid: user.uid , mail: email},
        });
        nave("/home");
        // dispatch(
        //   fuseActions.showMessage({
        //     message: "You have successfully logined.",
        //     variant: "success",
        //     timer:5000
        //   })
        // );
      }
      else if (response.data.toString().length == 42 && response.data.toString().toLowerCase().substring(0,2) == "0x"){

        console.log("reponse==", response);
        localStorage.setItem("@uid", user.uid);
        localStorage.setItem("address", response.data);
        localStorage.setItem("mail", email);
        dispatch({
          type: LOGIN,
          payload: { address: response.data, uid: user.uid , mail: email},
        });
        nave("/home");
        // dispatch(
        //   fuseActions.showMessage({
        //     message: "You have successfully logined.",
        //     variant: "success",
        //     timer:5000
        //   })
        // );
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log("error==", errorMessage);
      dispatch(
        fuseActions.showMessage({ message: errorMessage, variant: "error" })
      );
    });
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("@uid");
  localStorage.removeItem("address");
  localStorage.removeItem("mail");
  dispatch({ type: LOGOUT });
  dispatch(layoutActions.setAvatar(""));
};

export const reset = (email,auth) => async (dispatch) => {
  
  //@ts-ignoreawait auth.sendPasswordResetEmail(email);
  await sendPasswordResetEmail(auth,email);
  dispatch(
    fuseActions.showMessage({
      message: "Sent Reset Mail. Check Your Mail Box Now.",
      variant: "success",
      timer:5000
    })
  );
}
