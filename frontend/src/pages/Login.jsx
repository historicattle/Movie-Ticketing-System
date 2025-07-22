import { Link } from 'react-router-dom'
import './SignUp.css'

function Login(){
    return (
        <div id="container">
            <h1>Login to Your Account</h1>
            <div className='combine'>
                <h3>Email</h3>
                <input type="email" placeholder="Enter your email" />
            </div>
            <div className='combine'>
                <h3>Password</h3>
                <input type="password" placeholder="Enter your password" />
            </div>
            <button id='submit'>Login</button>
            <p>Don't have an account? <Link id='signupLnk' to="/signup">Sign Up</Link></p>
        </div>
    )
}

export default Login