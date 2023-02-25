import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

function EditComment() {
    const [comment, setComment] = useState()
    const [text, setText] = useState()
    const navigate = useNavigate()
    const routeParam = useParams().commentId
    console.log(routeParam)
    
    const fetchComment = async () => { //Fetch one comment by commentId
        const res = await fetch("/api/list/comment/"+routeParam)
        if(res.status === 200) {
            const data = await res.json();
            setComment(data)
            console.log(data.content)
        } else if(res.status === 404) {   
            //HANDLE
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
        }
    }

    if(comment) {
        return (
            <Box>
                <Typography>Edit your comment</Typography>
                <TextField defaultValue={comment.content} onChange={(e) => setText(e.target.value)}></TextField>
                <Button onClick={handleClick}>Save edit</Button>
            </Box>
        )  
    }
    
}
export default EditComment;