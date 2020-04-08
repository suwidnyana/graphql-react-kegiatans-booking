import React, { Component } from 'react'
import './Auth.css';

class AuthPage extends Component {
    constructor(props) {
        super(props)
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();

    }


    submitHandler = (event) => {

        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if(email.trim().length === 0 || password.trim().length === 0)
        {
            return;
        }

        console.log(email, password)

    }
    render()
    {
        return <form className="auth-form" onSubmit={this.submitHandler}>
            
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref={this.emailEl}/>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={this.passwordEl}/>
            </div>
            <div className="form-actions">
               <button type="submit">Sumit</button>
               <button type="button">Switch TO Signtup</button>

            </div>
        </form>
    }
}


export default AuthPage;