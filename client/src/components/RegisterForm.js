import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function RegisterForm() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/api/user/register", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data.status)
            if(data.status === "New user created.") { //STATUS NUMEROLLA PITÄÄ SÄÄTÄÄ TÄÄ
                navigate("/login");
            }
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                
                <TextField sx={{margin: 2}} id="outlined-basic" label="Email" variant="outlined" required={true}  onChange={(e) => setEmail(e.target.value)}></TextField>
                
                <TextField sx={{margin: 2}} id="outlined-basic" label="Username" variant="outlined" required={true}  onChange={(e) => setUsername(e.target.value)}></TextField>
                
                <TextField sx={{margin: 2}} id="outlined-basic" label="Password" variant="outlined" required={true}  onChange={(e) => setPassword(e.target.value)}></TextField>
                <br/>
                
                <Button variant="contained" type="submit">Register</Button>
            </form>
        </div>
    )
  }
export default RegisterForm;