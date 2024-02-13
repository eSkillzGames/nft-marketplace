import axios from "axios";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { fuseActions, layoutActions } from ".";
export const REGISTER = "REGISTER";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const SET_BALANCE = "SET_BALANCE";

export const register =
  (nave, email, password, userName, value, file, storageRef, firebase, endLoading) =>
    async (dispatch) => {
      try {
        const res = await axios.post("/api/user/signup", {
          email,
          password,
          userName,
          value,
        });
        console.log("response0==", res.data);
        if (file) {
          var uploadTask = storageRef
            .child(`users/${res.data.userResponse.uid}.jpeg`)
            .put(file);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => { },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log("File available at", downloadURL);
              });
            }
          );
        }
        const response1 = await axios.post(
          process.env.REACT_APP_API_URL + "/sendtransaction/v1/updateCurrentSkill",
          { UserID: res.data.userResponse.uid, Account: res.data.address }
        );
        console.log("updateCurrentSkill->", response1);
        dispatch(
          fuseActions.showMessage({
            message:
              "Thank you for signing up, please download the game from the links below.",
            variant: "success",
            timer: 5000,
          })
        );
        endLoading();
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
        endLoading();
        console.log("error==", error.message);
        dispatch(
          fuseActions.showMessage({
            message: error.message,
            variant: "error",
            timer: 5000,
          })
        );
      }
    };

export const login = (nave, auth, email, password, endLoading) => async (dispatch) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("user==", user);
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/sendtransaction/v1/getEskillzAccount",
        { UserID: user.uid }
      );
      if (response.data == "Wallet Address does not exist now.") {
        const response_create = await axios.post(
          process.env.REACT_APP_API_URL +
          "/sendtransaction/v1/CreateEskillzAccount",
          { UserID: user.uid, userName: "Nothing" }
        );
        console.log("reponse==", response_create);
        localStorage.setItem("@uid", user.uid);
        localStorage.setItem("address", response_create.data);
        localStorage.setItem("mail", email);
        const response1 = await axios.post(
          process.env.REACT_APP_API_URL +
          "/sendtransaction/v1/updateCurrentSkill",
          { UserID: user.uid, Account: response_create.data }
        );
        console.log("updateCurrentSkill->", response1);

        const resMatic = await axios({
          method: "post",
          url:
            process.env.REACT_APP_API_URL +
            "/sendTransaction/v1/getMaticBalance",
          data: { address: response_create.data },
          headers: {
            "Content-Type": `application/json`,
          },
        });

        const maticBalDec = resMatic.data.balance;
        localStorage.setItem("matic", maticBalDec);

        const resSkill = await axios({
          method: "post",
          url: process.env.REACT_APP_API_URL + "/sendTransaction/v1/getSkill",
          data: { Account: response_create.data },
          headers: {
            "Content-Type": `application/json`,
          },
        });

        let sportBalDec = resSkill.data.data;
        sportBalDec = Number(sportBalDec) / 10 ** 9;
        localStorage.setItem("skill", sportBalDec);

        dispatch({
          type: LOGIN,
          payload: {
            address: response_create.data,
            uid: user.uid,
            mail: email,
            MaticBal: maticBalDec,
            SportBal: sportBalDec.toFixed(2),
          },
        });
        nave("/home");
        // dispatch(
        //   fuseActions.showMessage({
        //     message: "You have successfully logined.",
        //     variant: "success",
        //     timer:5000
        //   })
        // );
      } else if (
        response.data.toString().length == 42 &&
        response.data.toString().toLowerCase().substring(0, 2) == "0x"
      ) {
        console.log("reponse==", response);
        localStorage.setItem("@uid", user.uid);
        localStorage.setItem("address", response.data);
        localStorage.setItem("mail", email);
        const response1 = await axios.post(
          process.env.REACT_APP_API_URL +
          "/sendtransaction/v1/updateCurrentSkill",
          { UserID: user.uid, Account: response.data }
        );
        console.log("updateCurrentSkill->", response1);

        const resMatic = await axios({
          method: "post",
          url:
            process.env.REACT_APP_API_URL +
            "/sendTransaction/v1/getMaticBalance",
          data: { address: response.data },
          headers: {
            "Content-Type": `application/json`,
          },
        });

        const maticBalDec = resMatic.data.balance;
        localStorage.setItem("matic", maticBalDec);

        const resSkill = await axios({
          method: "post",
          url: process.env.REACT_APP_API_URL + "/sendTransaction/v1/getSkill",
          data: { Account: response.data },
          headers: {
            "Content-Type": `application/json`,
          },
        });

        let sportBalDec = resSkill.data.data;
        sportBalDec = Number(sportBalDec) / 10 ** 9;
        localStorage.setItem("skill", sportBalDec);

        dispatch({
          type: LOGIN,
          payload: {
            address: response.data,
            uid: user.uid,
            mail: email,
            MaticBal: maticBalDec,
            SportBal: sportBalDec.toFixed(2),
          },
        });
        endLoading();
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
      endLoading();
      dispatch(
        fuseActions.showMessage({ message: errorMessage, variant: "error" })
      );
    });
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("@uid");
  localStorage.removeItem("address");
  localStorage.removeItem("mail");
  localStorage.removeItem("matic");
  localStorage.removeItem("skill");
  dispatch({ type: LOGOUT });
  dispatch(layoutActions.setAvatar(""));
};

export const reset = (email, auth, endLoading) => async (dispatch) => {
  const { data } = await axios.post("/api/user/getByEmail", { email });
  if (data.success) {
    //@ts-ignoreawait auth.sendPasswordResetEmail(email);
    await sendPasswordResetEmail(auth, email);
    dispatch(
      fuseActions.showMessage({
        message: "Sent Reset Mail. Check Your Mail Box Now.",
        variant: "success",
        timer: 5000,
      })
    );
    endLoading();
  } else {
    endLoading();
    dispatch(
      fuseActions.showMessage({
        message: "Email doesn't exist.",
        variant: "error",
        timer: 5000,
      })
    );
  }
};

export const setBalance = (address) => async (dispatch) => {
  const res = await axios({
    method: "post",
    url: process.env.REACT_APP_API_URL + "/sendTransaction/v1/getMaticBalance",
    data: { address },
    headers: {
      "Content-Type": `application/json`,
    },
  });


  const resSkill = await axios({
    method: "post",
    url: process.env.REACT_APP_API_URL + "/sendTransaction/v1/getSkill",
    data: { Account: address },
    headers: {
      "Content-Type": `application/json`,
    },
  });

  if (res.status == 200 && resSkill.data.data) {
    const maticBalDec = res.data.balance;
    localStorage.setItem("matic", maticBalDec);
    let sportBalDec = resSkill.data.data;
    sportBalDec = Number(sportBalDec) / 10 ** 9;
    localStorage.setItem("skill", sportBalDec);

    dispatch({
      type: SET_BALANCE,
      payload: { MaticBal: maticBalDec, SportBal: sportBalDec.toFixed(2) },
    });
  }
  else return;
};
