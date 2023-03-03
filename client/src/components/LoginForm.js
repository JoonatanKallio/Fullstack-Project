import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState()
    const navigate = useNavigate();

    const handleSubmit = async (e) => { //Post request to submit login
        e.preventDefault();
        const res = await fetch("/api/user/login",{
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(res.status === 200) {
            const data = await res.json()
            localStorage.setItem("token", data.token) //Set the token to the local storage if login success
            navigate("/");
        } else {
            const data = await res.json()
            setNotification(data.status)
        }
    } 

    return (
        <>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}} component="form" onSubmit={handleSubmit}>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <h1>Login here</h1>
                    <TextField sx={{margin: 2}} className='login-email' id="outlined-basic" label="Email" variant="outlined" required={true}  onChange={(e) => setEmail(e.target.value)}></TextField>
                    <TextField sx={{margin: 2}} className='login-password' id="outlined-adornment-password" label="Password" variant="outlined" type="password" required={true}  onChange={(e) => setPassword(e.target.value)}></TextField>
                    <br/>
                    <Notifications notifs={notification}></Notifications>
                    <Button sx={{marginTop: 3}} className='login-button' variant="contained" type="submit">Login</Button>
                </Box>
                
            </Box>
                
        </>
    )
  }
export default LoginForm;