// import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import LeaderBoardPage from "./pages/leaderboard";
import Token from "./pages/token";
import Presale from "./pages/presale/index";
import Register from "./pages/register";
import VerifyCode from "./pages/verifyCode";
import Profile from "./pages/profile";
import PrivateRoute from "./components/common/PrivateRouter";
import Layout from "./layout";
import Login from "./pages/login";
import Forgot from "./pages/forgot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Layout>
                <HomePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <Layout>
                <LeaderBoardPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
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
              <Layout>
                <Token />
              </Layout>              
            </PrivateRoute>
          }
        />
        <Route
          path="/presale"
          element={
            <PrivateRoute>
              <Layout>
                <Presale />
              </Layout>                 
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
