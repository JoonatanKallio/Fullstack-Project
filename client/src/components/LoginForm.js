import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/api/user/login",{
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data)
            if(data.status === "Login successful.") { //STATUS NUMEROLLA PITÄÄ SÄÄTÄÄ TÄÄ
                console.log(data.token)
                localStorage.setItem("token", data.token)
                navigate("/");
            }
        })
    } // #1E8759

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <TextField  id="outlined-basic" label="Email" variant="outlined" required={true}  onChange={(e) => setEmail(e.target.value)}></TextField>
                <br/>
                <TextField  id="outlined-basic" label="Password" variant="outlined" required={true}  onChange={(e) => setPassword(e.target.value)}></TextField>
                <br/>
                <Button variant="contained" type="submit">Login</Button>
            </form>
        </div>
    )
  }
export default LoginForm;