
import { Box, Button, TextField, Typography } from '@mui/material';

import { convertToRaw, EditorState } from 'draft-js';
import { useEffect, useState } from 'react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate } from 'react-router-dom';

function ListPost({data, navigate}) {
    console.log(data)
    const handleClick = (id) => {
        navigate("/post/"+id)
    }

    

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems:"center", width: "100%" }}>
                {data.map(post => 
                    <Box sx={{cursor:'grab', backgroundColor: "lightgray", margin: "5px", width: {xs: "90%", sm: "60%"}, height: "50px", "&:hover": {transition: "all 0.5s",  backgroundColor: "gray"}}} onClick={() => handleClick(post._id)} key={post._id}>{post.title} | @{post.owner.username}</Box>
                )}
        </Box>
    )
}



function Loggedin({data, navigate}) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [title, setTitle] = useState()
    const [notification, setNotification] = useState()

    const createPost = async () => {
        if(title) {
            const raw = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
            const res = await fetch("/api/upload/post", {
                method: "POST",
                body: JSON.stringify({
                    title: title,
                    content: raw
                }),
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            if (res.status === 201) {
                window.location.reload()
            }
        } else {
            setNotification("Please add a title")
        }
        
    }

    function onEditorStateChange (editorState) {
        setEditorState(editorState)
    }
    



    return (
        <Box sx={{width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}}>
            <Box component="form">
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center",width: "100%"}}>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", width: {xs: "90%", sm: "60%"}, border: "2px solid black"}}>
                        <Typography sx={{fontSize: "32px", margin: "10px"}}>Create a post</Typography>
                        <TextField sx={{margin: "10px"}}id="title outlined-basic" className="post-title-text" required label="Title" variant="outlined" onChange={(e) => setTitle(e.target.value)}></TextField>
                        <Box sx={{width: "100%"}}>
                            <Editor
                                editorState={editorState}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={onEditorStateChange}
                            />
                        </Box>
                        <Button onClick={createPost} className="submit-post" style={{marginTop: 20, marginBottom: 20}} variant="contained" color="primary" type='submit'>Post</Button>
                    </Box>
                </Box>
            </Box>
           
            <Box sx={{width: "100%"}}>
            <h1>Current posts</h1>
            <ListPost data={data} navigate={navigate}/>
            </Box>
            
        </Box>
        
    )
}

function Notloggedin ({data, navigate}) {
    return (
        <Box style={{width: "100%",display: "flex", flexDirection: "column", alignItems:"center"}}>
                <h1>Current posts</h1>
                <ListPost data={data} navigate={navigate}/> 
        </Box>
    )
}


function Posts() {
    const [data, setData] = useState([])
    const navigate = useNavigate();

    const fetchPosts = async () => {
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