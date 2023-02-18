function RegisterForm() {
    return (
        <div>
            <form>
                <label>
                    Email
                    <input type="text" name="email" id="email"></input>
                </label>
                <br/>
                <label>
                    Username
                    <input type="text" name="username" id="username"></input>
                </label>
                <br/>
                <label>
                    Password
                    <input type="text" name="password" id="password"></input>
                </label>
                <br/>
                <input type="submit" name="submit" id="submit"></input>
            </form>
        </div>
    )
  }
export default RegisterForm;