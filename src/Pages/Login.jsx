import React from 'react'
import '../style/style.css'
const Login = () => {
  return (
   <div className="container">
        <div className="login-form">
            <h1>Login</h1>
            <form action="">
                    <div className="input-group">
                        <input type="text" placeholder="Username" className="form-control" id="username"/>
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password" className="form-control" id="password"/> 
                    </div>
                    <div className="input-group">
                        <input type="submit"  placeholder="Login" value="Login" className="form-control" id="submit"/> 
                    </div>
            </form>
        </div>
    </div>
  )
}

export default Login