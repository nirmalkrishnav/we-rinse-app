import React from 'react';
import './App.css';
import NavbarComponent from './components/navbar/navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Map from './components/Map/Map';
import Home from './components/Home/Home';

function App() {
  return (
    <Router>
      <NavbarComponent />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/map" component={Map} />
      </Switch>
    </Router>
  );
}

export default App;
