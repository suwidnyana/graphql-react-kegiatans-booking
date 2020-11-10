import React, {useContext,useEffect} from 'react'
import {AuthContext} from '../context/auth-context'
import {Redirect} from 'react-router-dom'


const withAuth = ( Component ) => {
   
   
  
    return function New(props) {
        const {auth, token} = useContext(AuthContext)
        const tokenStorage = localStorage.getItem("token")
       

    
if(!tokenStorage) {
            return <Redirect  to='/auth'/>
         }
        let requestBody = {
            query: `
              query auth($token: String!) {
                auth( token: $token) {
                 userId
                    email
                  authenticated
                  
                }
              }
            `,
            variables: {
             token: tokenStorage
            }
          };

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
              if (!resData.data.auth.authenticated) {
                return <Redirect  to='/auth'/>
                    
              }
              console.log(resData)
              if(token && tokenStorage) {
                  return
              }
              auth(tokenStorage,resData.data.auth.userId,resData.data.auth.email)
              
            })
            .catch(err => {
              console.log(err);
              return <Redirect  to='/auth'/>
            });   
        
      
      
        return <Component {...props} />
      }
}

export default withAuth;