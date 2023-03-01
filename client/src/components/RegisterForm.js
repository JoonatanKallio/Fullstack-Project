import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("")
    const [notification, setNotification] = useState()
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/user/register", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                bio: bio
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if(res.status=== 201) {
            navigate("/login");
        } else if(res.status === 400) {
            const data = await res.json();
            if(data.status) {
                setNotification(data.status)
            } else if(data.errors) {
                if(data.errors[0].param === "email") {
                    console.log(data)
                    setNotification("Not an email")
                } else if(data.errors[0].param === "password") {
                    setNotification("Password is not strong enough. (8 characters, 1 upper and lowercase, 1 number and 1 special character)")
                } else if (data.errors[0].param ===  "username") {
                    setNotification("Username must be 3 characters long.")
                }
            }
            
        }
    }

    return (
        <>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}} component="form" onSubmit={handleSubmit} >

                <TextField sx={{margin: 2}} id="outlined-basic" className='register-email' label="Email" variant="outlined" required={true}  onChange={(e) => setEmail(e.target.value)}></TextField>
                
                <TextField sx={{margin: 2}} id="outlined-basic" className='register-username' label="Username" variant="outlined" required={true}  onChange={(e) => setUsername(e.target.value)}></TextField>
                
                <TextField sx={{margin: 2}} id="outlined-basic" className='register-password' label="Password" type="password" variant="outlined" required={true}  onChange={(e) => setPassword(e.target.value)}></TextField>
                
                <TextField sx={{margin: 2}} id="outlined-basic" className='register-bio' label="Bio" variant="outlined" onChange={(e) => setBio(e.target.value)}></TextField>
                <br/>
                <Notifications notifs={notification}/>
                <Button id="register-submit" variant="contained" type="submit">Register</Button>
            </Box>
        </>
    )
  }
export default RegisterForm;