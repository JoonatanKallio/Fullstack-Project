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
                <label>
                    Email
                    <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)}/>
                </label>
                <br/>
                <label>
                    Username
                    <input type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)}/>
                </label>
                <br/>
                <label>
                    Password
                    <input type="text" name="password" id="password" onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <br/>
                <input type="submit" name="submit" id="submit" />
            </form>
        </div>
    )
  }
export default RegisterForm;