
import { Box, Button, TextField, Typography } from '@mui/material';
import { convertToRaw, EditorState } from 'draft-js';
import { useState } from 'react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';

function CreatePost() {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [title, setTitle] = useState()
    const [notification, setNotification] = useState()
    const navigate = useNavigate()

    const navmenu = () => {
        navigate("/")
    }

    const createPost = async (e) => { //Sends post method to create post 
        e.preventDefault()
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
                navigate("/")
            }
        } else {
            setNotification("Please add a title")
        }
    }

    function onEditorStateChange (editorState) { //Wysiwyg editor state changer
        setEditorState(editorState)
    }

    if(localStorage.getItem("token")) { //If user logged in return the post wysiwyg editor
        return (
            <Box  sx={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Box component="form" sx={{display: "flex", flexDirection: "column", alignItems: "center", width: {xs: "90%", sm: "60%"}, border: "2px solid black", marginTop: "20px"}}>
                    <Typography sx={{fontSize: "32px", margin: "10px"}}>Create a post</Typography>
                    <TextField inputProps={{ maxLength: 60 }} sx={{margin: "10px", width: {xs: "90%", sm: "60%"}}}id="title outlined-basic" className="post-title-text" required label="Title" variant="outlined" onChange={(e) => setTitle(e.target.value)}></TextField>
                    <Box sx={{width: "100%"}}>
                        <Editor
                            editorState={editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={onEditorStateChange}
                            toolbar= {{
                                options: ['blockType', 'inline', 'fontSize', 'list'],
                                inline: { inDropdown: true },
                                fontsize: { inDropdown: true },
                                blockType: { inDropdown: true },
                                list: { inDropdown: true }
                            }}
                        />
                    </Box>
                    <Notifications notifs={notification}></Notifications>
                    <Box>
                        <Button onClick={(e) => createPost(e)} className="submit-post" style={{marginTop: 20, marginBottom: 20, marginRight: "10px"}} variant="contained" color="primary" type='submit'>Submit</Button>
                        <Button onClick={navmenu} style={{marginTop: 20, marginBottom: 20, marginLeft: "10px"}} variant="contained" color="primary" type='submit'>Cancel</Button>
                    </Box>
                </Box>
            </Box>
            
        )
    }
}

export default CreatePost;