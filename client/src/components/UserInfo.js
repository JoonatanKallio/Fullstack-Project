import { Box, Typography } from '@mui/material';
import * as DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PostList ({post}) {
    if(post.solved === true) {
        return (
            <Box sx={{fontSize: "12px", width: "100%", border: "1px solid black", background: "lightGreen"}} key={post._id}>
                <Typography>Solved.</Typography>  
                <Typography>{post.title}</Typography>  
                <Box multiline="true" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftToHtml(JSON.parse(post.content))) }}></Box> 
            </Box>
        )
    } else {
        return (
            <Box sx={{fontSize: "12px", width: "100%", border: "1px solid black", background: "lightgray"}} key={post._id}>
                <Typography>{post.title}</Typography>  
                <Box multiline="true" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftToHtml(JSON.parse(post.content))) }}></Box> 
            </Box>
        )
    }
    
    
}


function UserInfo() {
    const routeParam = useParams().userId;
    const [user, setUser] = useState()
    const [posts, setPosts] = useState()

    const fetchUser = async () => {
        const res = await fetch("/api/list/user/"+routeParam)
        if(res.status === 200) {
            const data1 = await res.json();
            console.log(data1)
            setUser(data1)
        }
    }

    const fetchPosts = async () => {
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

    if(user) {
        if(posts) {
            return (
                <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                    <Box sx={{width: {xs: "90%", sm: "60%"}, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
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
                        <Typography sx={{fontSize: "32px", margin: "10px"}}>User profile information</Typography>
                        <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>   
                            <Typography>Username: @{user.username}</Typography>
                            <Typography>User profile created: {DateTime.fromJSDate(new Date(user.createdAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                            <Typography>Bio: {user.bio}</Typography>
                        </Box>
                        <Typography sx={{fontSize: "24px"}}>Posts from @{user.username}</Typography>
                        <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>   
                            <Typography sx={{fontSize: "32px"}}>No posts from @{user.username}</Typography>
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