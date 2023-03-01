import { Box, Button, Paper, Typography } from '@mui/material';
import * as DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { navigate, useNavigate, useParams } from 'react-router-dom';

function PostList ({post}) { //Lists all the users posts
    const navigate = useNavigate()
    if(post.solved === true) { //Lists solved posts
        return (
            <Paper sx={{margin: "10px", padding: "5px", fontSize: "12px", width: "100%", border: "1px solid black", background: "lightGreen", "&:hover": {transition: "all 0.5s",  backgroundColor: "green"}}} key={post._id} onClick={() => navigate("/post/"+post._id)}  >
                <Typography>Solved.</Typography>  
                <Typography sx={{textDecoration: "underline"}}>{post.title}</Typography>  
                <Box  sx={{fontSize: "16px"}} multiline="true" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftToHtml(JSON.parse(post.content))) }}></Box> 
            </Paper>
        )
    } else { //Lists non-solved posts
        return (
            <Paper sx={{margin: "10px", padding: "5px", fontSize: "12px", width: "100%", border: "1px solid black", background: "lightgray", "&:hover": {transition: "all 0.5s",  backgroundColor: "gray"}}} key={post._id} onClick={() => navigate("/post/"+post._id)}>
                <Typography sx={{textDecoration: "underline"}}>{post.title}</Typography>  
                <Box sx={{fontSize: "16px"}} multiline="true" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftToHtml(JSON.parse(post.content))) }}></Box> 
            </Paper>
        )
    }
    
    
}


function UserInfo() {
    const routeParam = useParams().userId;
    const [user, setUser] = useState()
    const [posts, setPosts] = useState()
    const navigate = useNavigate()

    const fetchUser = async () => { //Fetches user 
        const res = await fetch("/api/list/user/"+routeParam)
        if(res.status === 200) {
            const data1 = await res.json();
            console.log(data1)
            setUser(data1)
        }
    }

    const fetchPosts = async () => {//Fetches the users posts 
        const res = await fetch("/api/list/postsbyuser/"+routeParam)
        if(res.status === 200) {
            const data1 = await res.json();
            console.log(data1)
            setPosts(data1)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    useEffect(() => {
        fetchPosts()
    }, [user])

    if(user) { //Returns user information and posts and only user if the user has no posts yet
        if(posts) {
            return (
                <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                    <Box sx={{width: {xs: "90%", sm: "60%"}, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                        <Button sx={{margin: "10px"}} variant="contained" onClick={() => navigate("/")}>Back to home page</Button>
                        <Typography sx={{fontSize: "32px", margin: "10px"}}>User profile information</Typography>
                        <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>   
                            <Typography>Username: @{user.username}</Typography>
                            <Typography>User profile created: {DateTime.fromJSDate(new Date(user.createdAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                            <Typography>Bio: {user.bio}</Typography>
                        </Box>
                        <Typography sx={{fontSize: "24px"}}>Posts from @{user.username}</Typography>
                        <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>   
                            {posts.map(post =>        
                                <PostList key={post._id} post={post}></PostList>
                            )} 
                        </Box>
                    </Box>
                </Box>
            )
        } else {
            return (
                <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                    <Box sx={{width: {xs: "90%", sm: "60%"}, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                        <Button sx={{margin: "10px"}} variant="contained" onClick={() => navigate("/")}>Back to home page</Button>
                        <Typography sx={{fontSize: "32px", margin: "10px"}}>User profile information</Typography>
                        <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>   
                            <Typography>Username: @{user.username}</Typography>
                            <Typography>User profile created: {DateTime.fromJSDate(new Date(user.createdAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                            <Typography>Bio: {user.bio}</Typography>
                        </Box>
                        <Typography sx={{fontSize: "32px"}}>No posts from @{user.username}</Typography>
                        <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>   
                        </Box>
                    </Box>
                </Box>
            )
        }
    } else {
        return (
            <>
                <h1>Loading user and posts...</h1>
            </>
        )
    }
    
}
export default UserInfo;