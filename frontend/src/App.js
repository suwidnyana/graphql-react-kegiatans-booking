import React, {useContext} from 'react';

import './App.css';

import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'

import AuthPage  from './pages/Auth'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings'

import MainNavigation from '../src/components/Navigation/MainNavigation'
import { AuthContext } from './context/auth-context';


const App = () => {

  const { token } = useContext(AuthContext);

  
  
    return (
      <BrowserRouter>
        <>
            <MainNavigation />
            <main className="main-content">
                <Switch>
                  <Route path='/' component={AuthPage} exact/>
                  {token && <Redirect from='/auth' to='/bookings' exact/>}
                  {!token && <Route path='/auth' component={AuthPage}/> }
                  <Route path='/events' component={EventsPage}/>
                  {token && <Route path='/bookings' component={BookingsPage}/>}
                  {!token && <Redirect from='/bookings' to='/events' exact/>}
              </Switch>
            </main>
        </>
      </BrowserRouter>
    );
  
}

export default App;
