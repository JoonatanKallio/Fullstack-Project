import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Notifications from "./Notifications";

function EditComment() {
    const [comment, setComment] = useState()
    const [text, setText] = useState()
    const navigate = useNavigate()
    const routeParam = useParams().commentId
    const [notification, setNotification] = useState()
    
    const fetchComment = async () => { //Fetch one comment by commentId
        const res = await fetch("/api/list/comment/"+routeParam)
        if(res.status === 200) {
            const data = await res.json();
            setComment(data)
        } else if(res.status === 404) {   
            console.log("Error in the fetch.")
        }
    }
    
    useEffect(() => {
        fetchComment()
    }, [])

    const handleClick = async () => { //handle save edit click
        const res = await fetch("/api/edit/comment", {
            method: "PUT",
            body: JSON.stringify({
                id: comment._id,
                content: text
            }),
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        if(res.status === 200) {
            navigate("/post/"+ comment.post)
        } else {
            setNotification("Editing failed, relog and try again.")
        }
    }

    const handleCancel = () => {
        navigate("/post/"+comment.post)
    }

    if(comment) { //Returns the editing elements if comment exists
        return ( 
            <Box sx={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", marginTop: "10px", gap: "20px"}}>
                <Typography sx={{fontSize: "32px"}}>Edit your comment</Typography>
                <TextField className="comment-editing-box" defaultValue={comment.content} onChange={(e) => setText(e.target.value)}></TextField>
                <Notifications notifs={notification}></Notifications>
                <Box>
                    <Button className="save-comment-edit" onClick={handleClick}>Save edit</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </Box>
            </Box>
        )  
    }
}
export default EditComment;