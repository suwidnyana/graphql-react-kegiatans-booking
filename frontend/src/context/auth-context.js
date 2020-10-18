import React,{createContext,useState} from 'react'

export const AuthContext = createContext()

export default function AuthContextProvider ({children}) {
    const [state, setState] = useState({
        token: null,
        userId: null,
        email: null
      })
    
    
    
      const getLogin =  (token, userId, email) => {
       setState({token:token, userId:userId, email:email})
       localStorage.setItem("token", token)
    };
    
    const getLogout =  () => {
        setState({token:null, userId:null, email:null})
        localStorage.clear()
    };
    
    return (
        <AuthContext.Provider value={
            {
              token: state.token,
              userId: state.userId,
              email: state.email,
              login:getLogin,
              logout:getLogout
            }
          }>
            {children}
          </AuthContext.Provider>
    )
}