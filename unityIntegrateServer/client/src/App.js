import './App.css';
import Transaction from './components/Transaction';
import AppTransaction from './components/AppTransaction';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Helmet } from 'react-helmet';

function App() {
  return (
    <Router>
      <Helmet>
        <title>SEND-TRANSACTION</title>
      </Helmet>      
      <Switch>
        <Route path='/sendTransaction' component={Transaction} />
        <Route path='/metamaskApp' component={AppTransaction} />
      </Switch>
    </Router>
  );
}

export default App;
