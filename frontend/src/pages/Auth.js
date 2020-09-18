import React, {useState,createRef, useContext} from 'react'
import './Auth.css';
import {AuthContext} from '../context/auth-context'


const AuthPage = () => {

  const { login } = useContext(AuthContext)
  // const contextType = AuthContext;

  const [isLogin, setLogin] = useState(true)

  const emailEl = createRef()
  const passwordEl = createRef()
    
  const switchModeHandler = () => {
    setLogin(!isLogin)
  }


    // state = {
    //     isLogin: true
    //   };
    
   

    // constructor(props) {
    //     super(props)
    //     this.emailEl = React.createRef();
    //     this.passwordEl = React.createRef();

    // }

    //  const switchModeHandler = () => {
    //    setLogin(prevState => {
    //       return { isLogin: !prevState.isLogin };
    //     }); 
    //   };


    const submitHandler = event => {
      event.preventDefault();
      const email = emailEl.current.value;
      const password = passwordEl.current.value;

      if(email.trim().length === 0 || password.trim().length === 0)
      {
          return;
      }


      let requestBody = {
          query: `
            query login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                userId
                token
                tokenExpiration
              }
            }
          `,
          variables: {
            email: email,
            password: password
          }
        };

        if(!isLogin) {
          requestBody = {
              query: 
              `
              mutation {
                     buatUser(userInput: {email: "${email}", password: "${password}"}) 
                     {
                      _id
                      email
                     }     
              }
              `   
                
          };
        }
    
        fetch('http://localhost:8000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            if (resData.data.login.token) {
            login(
                resData.data.login.token,
                resData.data.login.userId,
                resData.data.login.tokenExpiration
              );
                
            }
            console.log(resData)
          })
          .catch(err => {
            console.log(err);
          });   
  }

        return (
        <form className="auth-form" onSubmit={submitHandler}>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input type="email" id="email"  ref = {emailEl}/>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password"  ref = {passwordEl}/>
            </div>
            <div className="form-actions">
               <button type="submit">{
          !isLogin ? 'Signup' : 'Login'
        }</button>
             
               <button type="button" onClick={switchModeHandler}>
                   Switch to {isLogin ? 'Signup' : 'Login' }
                </button>

            </div>
        </form>)
    
}


export default AuthPage;