import React from 'react';
import './App.css';
import NavbarComponent from './components/navbar/navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Map from './components/Map/Map';
import Home from './components/Home/Home';
import Location from './components/Location/Location';

function App() {
  return (
    <Router>
      <NavbarComponent />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/home" exact component={Home} />
        <Route path="/map" exact component={Map} />
        <Route path="/location/:id" component={Location} />

      </Switch>
    </Router>
  );
}

export default App;
