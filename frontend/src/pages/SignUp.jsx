import './SignUp.css'

function SignUp() {
    return (
        <>
        <title>SignUp</title>
        <div id="container">
            <h1>Create An Account</h1>

            <div className='combine'>
                <h3>Email</h3>
                <input type="email" placeholder="example@xyz.com"></input>
            </div>

            <div className='combine'>
                <h3>Password</h3>
                <input type="password" placeholder="Enter your password"></input>
            </div>

            <div className='combine'>
                <h3>Confirm Password</h3>
                <input type="password" placeholder="Confirm your password"></input>
            </div>

            <button id='submit'>SignUp</button>
        </div>
        </>
    );
}

export default SignUp