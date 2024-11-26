import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const [error, setErrorValue] = useState('');
    const navigate = useNavigate();

    function setUsername(event) {
        const username = event.target.value;
        setUsernameInput(username);
    }

    function setPassword(event) {
        const pswd = event.target.value;
        setPasswordInput(pswd);
    }

    async function submit() {
        setErrorValue('');
        try {
            const response = await axios.post('/api/users/login', {username: usernameInput, password: passwordInput})
            navigate('/');
        } catch (e) {
            setErrorValue(e.response.data)
        }

        // console.log(usernameInput, passwordInput);
    }

    return (
        <div>
            <h1>Login</h1>
            {!!error && <h2>{error}</h2>}
            <div>
                <span>Username: </span><input type='text' value={usernameInput} onInput={setUsername}></input>
            </div>
            <div>
                <span>Password: </span><input type='text' value={passwordInput} onInput={setPassword}></input>
            </div>

            <button onClick={submit}>Create Account/Login</button>
        </div>
    )


}