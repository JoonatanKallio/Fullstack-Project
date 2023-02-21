import { AppBar, Box, Button, Grid, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function Sitename ({navigate}) {
    const logoclick = () => {
        navigate("/")
    }
    return (
        <Typography sx={{  fontSize:{ xs: "24px", sm: "32px"}, cursor: "grab"}}onClick={logoclick} variant="h5" noWrap component="div">
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
            <Grid>
                <AppBar position="static">
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between", height:  "50.5px"}}variant="dense">

                        <Sitename navigate={navigate}/>

                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography sx={{ display: { xs: "none", sm: "inline"}, fontWeight: 600, marginRight: 2}}>
                                Logged in as {user.username}
                            </Typography>
                            <Button style={{fontWeight: 600, margin: 5}} onClick={logoutClick} variant="outlined" color="inherit">Logout</Button> 
                        </Box>
                    </Toolbar>
                </AppBar>
            </Grid>
        )
    } else {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar  sx={{display: "flex", justifyContent: "space-between", height:  "50.5px" }}variant="dense">

                        <Sitename navigate={navigate}/>

                        <div>
                            <Button sx={{fontWeight: 600, padding: {xs: "2px"}, margin: {xs: "5px", sm: "10px"}}} onClick={loginClick} variant="outlined" color="inherit">Login</Button>
                            <Button sx={{fontWeight: 600, padding: {xs: "2px"}, margin: {xs: "5px", sm: "10px"}}} onClick={registerClick} variant="outlined" color="inherit">Register</Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
        )
    }
}
export default Header;