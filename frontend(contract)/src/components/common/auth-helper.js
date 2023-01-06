const auth = {
  isLogined() {
    if (typeof window == "undefined") return false;

    if (localStorage.getItem("@uid")) return true;
    else return false;
  },
};

export default auth;
