
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
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <h1>Post a comment</h1>
            <TextField id="outlined-basic" className="comment-text" label="Comment" variant="outlined" onChange={(e) => setNewComment(e.target.value)}></TextField>
            <Button id="outlined" className="comment-submit" onClick={handleClick}>Send</Button>
        </Box>
    )
}

const handleEditClick = (postid, navigate) => {
    navigate("/post/edit/"+ postid)
}

const handleCommentEdit = (commentId, navigate) => {
    navigate("/comment/edit/"+commentId)
}

function EditCmt({userId, cAuthor, commentId, navigate}) {
    const token = userId
    const tokenContent = token.split(".")
    const decode = atob(tokenContent[1])
    const json = JSON.parse(decode)
    
    if(json.id === cAuthor._id) {
        return (
            <Button className='edit-comment' onClick={() => handleCommentEdit(commentId, navigate)}>Edit comment</Button>
        )
    }
}

function EditBtn({post, navigate}) {
    if(localStorage.getItem("token")) {
        const token = localStorage.getItem("token")
        const tokenContent = token.split(".")
        const decode = atob(tokenContent[1])
        const json = JSON.parse(decode)
        if(post.owner._id === json.id) {
            return (
                <Button className='edit-post' onClick={() => handleEditClick(post._id, navigate)}>Edit post</Button>
            )
        }
    }
}

function PostInfo({post, navigate}) {
    if(post.createdAt >= post.updatedAt) {
        return (
            <Box sx={{backgroundColor: "#dbdbdb", width: {xs: "90%", sm: "60%"}, margin: "24px", overflowWrap: 'break-word', border: "1px solid black"}}>
                <Typography multiline="true" sx={{fontSize: "24px", textDecoration: "underline"}}>{post.title}</Typography>
                <Box multiline="true" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftToHtml(JSON.parse(post.content))) }}></Box>
                <Typography>Posted @{post.owner.username}</Typography>
                <Typography>Posted {DateTime.fromJSDate(new Date(post.createdAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                <EditBtn post={post} navigate={navigate}></EditBtn>
            </Box>
        )
    }  else {
        return (
            <Box sx={{backgroundColor: "#dbdbdb", width: {xs: "90%", sm: "60%"}, margin: "24px", overflowWrap: 'break-word', border: "1px solid black"}}>
                <Typography multiline="true" sx={{fontSize: "24px", textDecoration: "underline"}}>{post.title}</Typography>
                <Box multiline="true" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftToHtml(JSON.parse(post.content))) }}></Box>
                <Typography>Posted @{post.owner.username}</Typography>
                <Typography>Edited {DateTime.fromJSDate(new Date(post.updatedAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                <EditBtn post={post} navigate={navigate}></EditBtn>
            </Box>
        )
    }
}

function Comment ({comment}) { //Different returns if the comment has been edited or not
    if(comment.createdAt >= comment.updatedAt) {
        return (
            <Box sx={{margin: "10px", backgroundColor: "#dbdbdb", border: "1px solid black"}}>
                <Typography>{comment.content} | @{comment.author.username} </Typography>
                <Typography>Created {DateTime.fromJSDate(new Date(comment.createdAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
            </Box>
        )
    } else {
        return (
            <Box sx={{margin: "10px", backgroundColor: "#dbdbdb", border: "1px solid black"}}>
                <Typography>{comment.content} | @{comment.author.username} </Typography>
                <Typography>Edited {DateTime.fromJSDate(new Date(comment.updatedAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
            </Box>
        )
    }
}

function Viewpost() {
    const [post, setPost] = useState("")
    const [comments, setComments] = useState("")
    const routeParam = useParams().postId
    const [newComment, setNewComment] = useState()
    const navigate = useNavigate();
    
    const fetchPost = async () => { //Fetch post by id
        const res = await fetch("/api/list/post/"+routeParam)
        if(res.status === 200) {
            const data = await res.json();
            setPost(data)
        } else if(res.status === 404) {   
            //HANDLE
        }
    }

    const fetchComments = async () => { //Fetch all comments by postId
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


    const handleHomepage = () => {
        navigate("/")
    }

    if(post && comments) { //Render posts and comments when they are fetched
        if(localStorage.getItem("token")) { //if user is logged in
            return ( 
                <Box sx={{display: "flex", flexDirection: "column", width: "100%", alignItems: "center"}}>
                    <Button sx={{marginTop: "10px"}} onClick={handleHomepage} variant="contained">Back to homepage</Button>
                    <PostInfo post={post} navigate={navigate}/>
                    <SendComment newComment={newComment} setNewComment={setNewComment} postId={post._id}  navigate={navigate}></SendComment>
                    <Box sx={{display: "flex", flexDirection: "column", width: { xs: "90%", sm: "60%"}, alignItems: "center"}}>
                        <Typography sx={{fontSize: "32px"}}>Comments:</Typography>
                        {comments.map(comment =>        
                            <Box sx={{fontSize: "24px", width: "100%", border: "1px solid black"}} key={comment._id}>
                                <Comment comment={comment}></Comment>
                                <EditCmt userId={localStorage.getItem("token")} cAuthor={comment.author} commentId={comment._id} navigate={navigate}></EditCmt>   
                            </Box>
                        )} 
                    </Box>
                </Box>
            )
        } else { //if no user is logged in
            return (
                <Box sx={{display: "flex", flexDirection: "column", width: "100%", alignItems: "center"}}>
                    <Button sx={{marginTop: "10px"}} onClick={handleHomepage} variant="contained">Back to homepage</Button>
                    <PostInfo post={post} navigate={navigate}/>
                    <Box sx={{display: "flex", flexDirection: "column", width: { xs: "90%", sm: "60%"}, alignItems: "center"}}>
                        <Typography sx={{fontSize: "32px"}}>Comments:</Typography>
                        {comments.map(comment =>              
                            <Box sx={{fontSize: "24px", width: "100%", border: "1px solid black"}} key={comment._id}>
                                <Comment comment={comment}></Comment>
                            </Box>
                        )} 
                    </Box> 
                </Box>
            )
        }
    } else { //when no posts or comments are loaded
        return (<h1>LOADING...</h1>)
    }
}
export default Viewpost;