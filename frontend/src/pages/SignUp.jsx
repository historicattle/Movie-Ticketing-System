import { useContext, useState } from 'react';
import axios from 'axios';
import '../styles/SignUp.css'
import UserContext from '../context/userContext';

function SignUp() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const { setIsUser } = useContext(UserContext)

	function handleSignUp(e) {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		const userData = {
			name: name,
			email: email,
			password: password
		}

		axios.post('http://localhost:3000/api/auth/signup', userData, { withCredentials: true })
			.catch((err) => { console.error(err); return; })
			.then(() => setIsUser(true));
	}


	return (
		<>
			<title>SignUp</title>
			<form onSubmit={handleSignUp} id='container'>
				<h1>Create An Account</h1>

				<div className='combine'>
					<label htmlFor='name'>Name</label>
					<input type="text" id="name" placeholder="Enter your name" name="name" autoComplete='name' onChange={(e) => setName(e.target.value)} required />
				</div>

				<div className='combine'>
					<label htmlFor='email'>Email</label>
					<input type="email" id="email" placeholder="example@xyz.com" name="email" autoComplete='email' onChange={(e) => setEmail(e.target.value)} required />
				</div>

				<div className='combine'>
					<label htmlFor='password'>Password</label>
					<input type="password" id="password" placeholder="Enter your password" name="password" autoComplete='new-password' onChange={(e) => setPassword(e.target.value)} required />
				</div>

				<div className='combine'>
					<label htmlFor='confirmPassword'>Confirm Password</label>
					<input type="password" id="confirmPassword" placeholder="Confirm your password" name="confirmPassword" autoComplete='new-password' onChange={(e) => setConfirmPassword(e.target.value)} required />
				</div>

				<button id='submit' type="submit">SignUp</button>
			</form>

		</>
	);
}

export default SignUp