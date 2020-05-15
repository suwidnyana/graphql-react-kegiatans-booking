import React, {Component} from 'react';

import './App.css';

import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'

import AuthPage  from './pages/Auth'
import EventsPage from './pages/Events'
import BookingsPage from './pages/Bookings'

import MainNavigation from '../src/components/Navigation/MainNavigation'
import AuthContext from './context/auth-context';


class App extends Component {

  
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                

                
                {this.state.token && <Redirect from="/" to="/events" exact/>}
                
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}

                {/* {this.state.token && 
                (
                  <Redirect from="/auth" to="/events" exact />
                )} */}

                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} /> 
                  //if token not available
                )} 

                <Route path="/events" component={EventsPage} 
                  //if token not available to but you acces events page
                />  
                
                {this.state.token && (
                  <Route path="/bookings" component={BookingsPage} 
                    //if token available you can access this page 
                  />
                )}
                  {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </>
      </BrowserRouter>
    );
  }
}

export default App;
