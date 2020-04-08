import React from 'react';

import './App.css';

import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'

import AuthPage  from './pages/Auth'
import Event from './pages/Events'
import Bookings from './pages/Bookings'

import MainNavigation from '../src/components/Navigation/MainNavigation'

function App() {
  return (
   <BrowserRouter>
    <React.Fragment>
      <MainNavigation/>
        <main className="main-content"> 
          <Switch>
            <Redirect from="/" to="/auth" exact/>
            <Route path="/auth" component={AuthPage}/>
            <Route path="/events" component={Event}/>
            <Route path="/bookings" component={Bookings}/>
          </Switch> 
        </main>
    </React.Fragment>
   </BrowserRouter>
  );
}

export default App;
