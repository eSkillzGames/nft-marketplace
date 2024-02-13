// import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import NewHome from "./pages/newhome";
import LeaderBoardPage from "./pages/leaderboard";
import Token from "./pages/token";
import Presale from "./pages/presale/index";
import Register from "./pages/register";
import VerifyCode from "./pages/verifyCode";
import Profile from "./pages/profile";
import Wallet from "./pages/wallet";
import NewLeaderBoard from "./pages/newleaderboard";
import PrivateRoute from "./components/common/PrivateRouter";
import Layout from "./layout";
import Login from "./pages/login";
import Forgot from "./pages/forgot";
import ProfileView from "./pages/profileview";
import Download from "./pages/download";
import PatchNotes from "./pages/patchnotes";
import PatchNoteDetail from "./pages/patchnotedetail";

function App(props) {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <NewHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <NewLeaderBoard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profileview/:pid"
            element={
              <PrivateRoute>
                <ProfileView />
              </PrivateRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <PrivateRoute>
                <Wallet />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verifyCode" element={<VerifyCode />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route
            path="/token"
            element={
              <PrivateRoute>
                <Token />
              </PrivateRoute>
            }
          />
          <Route
            path="/presale"
            element={
              <PrivateRoute>
                <Presale />
              </PrivateRoute>
            }
          />
          <Route
            path="/download"
            element={
              <PrivateRoute>
                <Download />
              </PrivateRoute>
            }
          />
          <Route
            path="/patch-notes"
            element={
              <PrivateRoute>
                <PatchNotes />
              </PrivateRoute>
            }
          />
          <Route
            path="/patch-notes/:pid"
            element={
              <PrivateRoute>
                <PatchNoteDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
