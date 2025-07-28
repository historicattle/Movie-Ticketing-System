import { createContext, useContext, useState} from 'react';
import axios from 'axios';
import '../styles/SignUp.css'
import UserContext from '../context/UserContext';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const setIsUser = useContext(UserContext)

    function handleSignUp() {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const userData = {
            email: email,
            password: password
        }

        axios.post('http://localhost:3000/api/auth/signup', userData, {withCredentials: true})
            .catch((err)=> {console.error(err);return;})
            .then(() => setIsUser(true));
    }

    return (
        <>
            <title>SignUp</title>
            <div id="container">
                <h1>Create An Account</h1>

                <div className='combine'>
                    <h3>Email</h3>
                    <input type="email" placeholder="example@xyz.com" onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className='combine'>
                    <h3>Password</h3>
                    <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div className='combine'>
                    <h3>Confirm Password</h3>
                    <input type="password" placeholder="Confirm your password" onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>

                <button id='submit' type="submit" onClick={handleSignUp}>SignUp</button>
            </div>
        </>
    );
}

export default SignUp