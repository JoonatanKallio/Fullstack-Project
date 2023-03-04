
import { Box, Button, Paper, Typography } from '@mui/material';

import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate } from 'react-router-dom';


function PostOverview ({post, navigate}) {
    const handleClick = (id) => {
        navigate("/post/"+id)
    }

    if(post.createdAt >= post.updatedAt) { //if post has been created and not edited return this
        return(
            <Paper sx={{display: "flex", flexDirection: "column", justifyContent: "center", padding: "10px", cursor:'grab', backgroundColor: "lightgray", margin: "5px", width: {xs: "90%", sm: "60%"}, height: "100px", "&:hover": {transition: "all 0.5s",  backgroundColor: "gray"}, border: "solid 1px black"}} onClick={() => handleClick(post._id)} key={post._id}>
                <Typography>{post.title} | @{post.owner.username}</Typography>
                <Typography>Created {DateTime.fromJSDate(new Date(post.updatedAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
            </Paper>
        )
    } else { //if post has been edited after creating return this
        if(post.solved === true) { //If post has been solved return green background
            return(
                <Paper sx={{display: "flex", flexDirection: "column", justifyContent: "center", padding: "10px", cursor:'grab', backgroundColor: "lightGreen", margin: "5px", width: {xs: "90%", sm: "60%"}, height: "100px", "&:hover": {transition: "all 0.5s",  backgroundColor: "green"}, border: "solid 1px black"}} onClick={() => handleClick(post._id)} key={post._id}>
                    <Typography>{post.title} | @{post.owner.username}</Typography>
                    <Typography>Marked as solved {DateTime.fromJSDate(new Date(post.updatedAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                </Paper>
            )
        } else { //If post has not been solved return gray background
            return(
                <Paper sx={{display: "flex", flexDirection: "column", justifyContent: "center", padding: "10px", cursor:'grab', backgroundColor: "lightgray", margin: "5px", width: {xs: "90%", sm: "60%"}, height: "100px", "&:hover": {transition: "all 0.5s",  backgroundColor: "gray"}, border: "solid 1px black"}} onClick={() => handleClick(post._id)} key={post._id}>
                    <Typography>{post.title} | @{post.owner.username}</Typography>
                    <Typography>Edited {DateTime.fromJSDate(new Date(post.updatedAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                </Paper>
            )
        }
        
    }

    
}

function ListPost({data, navigate}) { //Lists all the posts
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems:"center", width: "100%"}}>
                {data.map(post => 
                    <PostOverview key={post._id} post={post} navigate={navigate}></PostOverview>
                )}
        </Box>
    )
}

function Loggedin({data, navigate}) { //Logged in version to show create post button
    return (
        <Box sx={{width: "100%", display: "flex", alignItems: "center", flexDirection: "column", marginTop: "10px"}}>
            <Box >
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center",width: "100%"}}>
                    <Typography sx={{fontSize: "32px", fontWeight: "600"}}>Welcome to StackUnderflow!</Typography>
                    <Button sx={{margin: "10px"}}variant="contained" onClick={() => navigate("/post/create")}>Create a post</Button>
                </Box>
            </Box>
            <Box sx={{width: "100%"}}>
            <h1>Current posts</h1>
            <ListPost data={data} navigate={navigate}/>
            </Box>  
        </Box>
    )
}

function Notloggedin ({data, navigate}) { //not logged in version that doesn't have create post button
    return (
        <Box style={{width: "100%",display: "flex", flexDirection: "column", alignItems:"center", marginTop: "10px"}}>
                <Typography sx={{fontSize: "32px", fontWeight: "600"}}>Welcome to StackUnderflow!</Typography>
                <Typography sx={{fontSize: "24px", fontWeight: "600"}}>Login to post or comment.</Typography>
                <h1>Current posts</h1>
                <ListPost data={data} navigate={navigate}/> 
        </Box>
    )
}


function Posts() {
    const [data, setData] = useState([])
    const navigate = useNavigate();

    const fetchPosts = async () => { //Get request to get all the posts
        const res = await fetch("/api/list/posts")
        if(res.status === 200) {
            const data1 = await res.json();
            setData(data1)
        }
    }
    useEffect(() => {
        fetchPosts()
    }, [])

    if(localStorage.getItem("token")) {
        return (
            <Loggedin data={data} navigate={navigate}></Loggedin>
        )   
    } else {
        return (
            <Notloggedin data={data} navigate={navigate}></Notloggedin>
        )
    }
}

export default Posts;