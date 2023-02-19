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
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="text" name="email" id="email"  onChange={(e) => setEmail(e.target.value)}></input>
                </label>
                <br/>
                <label>
                    Password
                    <input type="text" name="password" id="password"onChange={(e) => setPassword(e.target.value)}></input>
                </label>
                <br/>
                <input type="submit" name="submit" id="submit"></input>
            </form>
        </div>
    )
  }
export default LoginForm;