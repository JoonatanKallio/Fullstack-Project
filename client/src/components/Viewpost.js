
import { Box, Button, TextField, Typography } from '@mui/material';
import * as DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function SendComment ({newComment, setNewComment, postId, navigate}) {
    const handleClick = async () => {
        const res = await fetch("/api/upload/comment", {
            method: "POST",
            body: JSON.stringify({
                postid: postId,
                content: newComment
            }),
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        if (res.status === 201) {
            window.location.reload()
        }
    }
    return (
        <div>
            <h1>Post a comment</h1>
            <TextField id="outlined-basic" label="Comment" variant="outlined" onChange={(e) => setNewComment(e.target.value)}></TextField>
            <Button onClick={handleClick}>Send</Button>
            
        </div>
    )
}

function PostInfo({post}) {
    
    return (
        <Box sx={{backgroundColor: "#dbdbdb", width: {sx: "90%", sm: "60%"}, margin: "24px", overflowWrap: 'break-word'}}>
            <Typography multiline="true" sx={{fontSize: "24px", textDecoration: "underline"}}>{post.title}</Typography>
            <Box multiline="true" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftToHtml(JSON.parse(post.content))) }}></Box>
            <Typography>Posted by: {post.owner.username}</Typography>
            <Typography>Posted {DateTime.fromJSDate(new Date(post.createdAt)).toLocaleString()}</Typography>
        </Box>
    )
}

function Viewpost() {
    const [post, setPost] = useState("")
    const [comments, setComments] = useState("")
    const routeParam = useParams().postId
    const [newComment, setNewComment] = useState()
    const navigate = useNavigate();
    console.log(comments)
    const fetchPost = async () => {
        const res = await fetch("/api/list/post/"+routeParam)
        if(res.status === 200) {
            const data = await res.json();
            setPost(data)

        } else if(res.status === 404) {   
            //HANDLE
        }
    }

    const fetchComments = async () => {
        
        const res = await fetch("/api/list/comments/"+routeParam)
        if(res.status === 200) {
            const data = await res.json();
            setComments(data)
        }

    }

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [])



    if(post && comments) {
        if(localStorage.getItem("token")) {
            
            return (
                <Box sx={{display: "flex", flexDirection: "column", width: "100%", alignItems: "center"}}>
                    <PostInfo post={post}/>
                    <SendComment newComment={newComment} setNewComment={setNewComment} postId={post._id}  navigate={navigate}></SendComment>
                    <Box sx={{display: "flex", flexDirection: "column", width: { xs: "90%", sm: "60%"}, alignItems: "center"}}>
                        <Typography sx={{fontSize: "32px"}}>Comments:</Typography>
                        {comments.map(comment =>              
                            <Box sx={{fontSize: "24px", backgroundColor: "#dbdbdb", width: "100%", border: "1px solid black"}} key={comment._id}>{comment.content} | By {comment.author.username}</Box>
                        )} 
                    </Box>
                    
                      
                </Box>
            )
        } else {
            return (
                <Box sx={{display: "flex", flexDirection: "column", width: "100%", alignItems: "center"}}>
                    <PostInfo post={post}/>
                    <Box sx={{display: "flex", flexDirection: "column", width: { xs: "90%", sm: "60%"}, alignItems: "center"}}>
                        <Typography sx={{fontSize: "32px"}}>Comments:</Typography>
                        {comments.map(comment =>              
                            <Box sx={{fontSize: "24px", backgroundColor: "#dbdbdb", width: "100%", border: "1px solid black"}} key={comment._id}>{comment.content} | By {comment.author.username}</Box>
                        )} 
                    </Box> 
                </Box>
            )
        }
        
    } else {
        return (<h1>LOADING...</h1>)
        
    }
    
}
export default Viewpost;