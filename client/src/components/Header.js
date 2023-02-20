import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function Sitename ({navigate}) {
    const logoclick = () => {
        navigate("/")
    }
    return (
        <Typography onClick={logoclick} sx={{cursor: "grab"}} variant="h5" noWrap component="div">
            Stack Underflow
        </Typography>
    )
}

function Header() {
    const navigate = useNavigate();

    const loginClick = () => {
        navigate("/login")
    }
    
    const registerClick = () => {
        navigate("/register")
    }

    

    const logoutClick = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    let user
    if(localStorage.getItem("token")){
      let token = localStorage.getItem("token")
      const tokenContent = token.split(".")
      const decode = atob(tokenContent[1])
      user = JSON.parse(decode)
    }

    if(user){
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}variant="dense">

                        <Sitename navigate={navigate}/>

                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <p style={{fontWeight: 600, margin: 5}}>
                                Logged in as {user.username}
                            </p>
                            <Button style={{fontWeight: 600, margin: 5}} onClick={logoutClick} variant="outlined" color="inherit">Logout</Button> 
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        )
    } else {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar  sx={{display: "flex", justifyContent: "space-between" }}variant="dense">

                        <Sitename navigate={navigate}/>

                        <div>
                            <Button style={{fontWeight: 600, margin: 5}} onClick={loginClick} variant="outlined" color="inherit">Login</Button>
                            <Button style={{fontWeight: 600, margin: 5}} onClick={registerClick} variant="outlined" color="inherit">Register</Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }
}
export default Header;