
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import * as DOMPurify from 'dompurify';
import draftToHtml from 'draftjs-to-html';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function SendComment ({newComment, setNewComment, post, navigate}) {
    console.log(post.solved)
    const handleClick = async () => {
        const res = await fetch("/api/upload/comment", {
            method: "POST",
            body: JSON.stringify({
                postid: post._id,
                content: newComment,
                solved: post.solved
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
    if(post.solved !== true) {
        return (
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <h1>Post a comment</h1>
                <TextField id="outlined-basic" className="comment-text" label="Comment" variant="outlined" onChange={(e) => setNewComment(e.target.value)}></TextField>
                <Button sx={{marginTop: "10px"}} variant="contained" id="outlined" className="comment-submit" onClick={handleClick}>Send</Button>
            </Box>
        )
    }
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
                <Button sx={{margin: "5px"}} variant="contained" className='edit-post' onClick={() => handleEditClick(post._id, navigate)}>Edit post</Button>
            )
        }
    }
}

const markAsSolved = async (postid, navigate) => {
    const res = await fetch("/api/solve/post", {
        method: "PUT",
        body: JSON.stringify({
            id: postid,
            solved: true
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

function SolveBtn({post, navigate}) {
    if(localStorage.getItem("token")) {
        const token = localStorage.getItem("token")
        const tokenContent = token.split(".")
        const decode = atob(tokenContent[1])
        const json = JSON.parse(decode)
        if(post.owner._id === json.id) {
            return (
                <Button sx={{margin: "5px"}} variant="contained" className='mark-as-solved' onClick={() => markAsSolved(post._id, navigate)}>Mark as solved</Button>
            )
        }
    }
}



function PostInfo({post, navigate}) {
    const goToProfile = () => {
        navigate("/user/"+post.owner._id)
    }

    if(post.createdAt >= post.updatedAt) { //Returns different versions depending on if the post has been edited or not
        return (
            <Paper sx={{backgroundColor: "#dbdbdb", width: {xs: "90%", sm: "60%"}, margin: "24px", overflowWrap: 'break-word', border: "1px solid black", padding: "10px"}}>
                <Typography multiline="true" sx={{fontSize: "24px", textDecoration: "underline"}}>{post.title}</Typography>
                <Box multiline="true" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftToHtml(JSON.parse(post.content))) }}></Box>
                <Typography sx={{display: "inline"}}>Posted </Typography>
                <Typography sx={{fontWeight: "bold", cursor: "grab", display: "inline"}} onClick={goToProfile}>@{post.owner.username}</Typography>
                <Typography>Posted {DateTime.fromJSDate(new Date(post.createdAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                <Box>
                    <EditBtn post={post} navigate={navigate}></EditBtn>
                    <SolveBtn post={post} navigate={navigate}></SolveBtn>
                </Box>
            </Paper>
        )
    }  else {
        if(post.solved === true) { //Checks if post is solved or not, since marking post as solve is always edit to the data, it is always edited so no need to check 
            return (               //this in the created if-clause above this
                <Paper sx={{backgroundColor: "lightGreen", width: {xs: "90%", sm: "60%"}, margin: "24px", overflowWrap: 'break-word', border: "1px solid black", padding: "10px"}}>
                    <Typography sx={{fontSize: "24px", textDecoration: "underline"}}>This question has been solved.</Typography>
                    <Typography multiline="true" sx={{fontSize: "24px", textDecoration: "underline"}}>{post.title}</Typography>
                    <Box multiline="true" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftToHtml(JSON.parse(post.content))) }}></Box>
                    <Typography sx={{display: "inline"}}>Posted </Typography>
                    <Typography sx={{fontWeight: "bold", cursor: "grab", display: "inline"}} onClick={goToProfile}>@{post.owner.username}</Typography>
                    <Typography>Edited {DateTime.fromJSDate(new Date(post.updatedAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                    <Box>
                        <EditBtn post={post} navigate={navigate}></EditBtn>
                        
                    </Box>
                </Paper>
            )
        } else { //Returns this if post is not solved so it has gray background
            return (
                <Paper sx={{backgroundColor: "#dbdbdb", width: {xs: "90%", sm: "60%"}, margin: "24px", overflowWrap: 'break-word', border: "1px solid black", padding: "10px"}}>
                    <Typography multiline="true" sx={{fontSize: "24px", textDecoration: "underline"}}>{post.title}</Typography>
                    <Box multiline="true" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftToHtml(JSON.parse(post.content))) }}></Box>
                    <Typography sx={{display: "inline"}}>Posted</Typography>
                    <Typography sx={{fontWeight: "bold", cursor: "grab", display: "inline"}} onClick={goToProfile}>@{post.owner.username}</Typography>
                    <Typography>Edited {DateTime.fromJSDate(new Date(post.updatedAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
                    <Box>
                        <EditBtn post={post} navigate={navigate}></EditBtn>
                        <SolveBtn post={post}></SolveBtn>
                    </Box>
                </Paper>
            )
        }
        
    }
}

function Comment ({comment}) { //Different returns if the comment has been edited or not
    const navigate = useNavigate()
    const goToProfile = () => {
        navigate("/user/"+comment.author._id)
    }
    if(comment.createdAt >= comment.updatedAt) { //Returns different versions depending on if the comment has been edited or not
        return (
            <Paper sx={{margin: "10px", backgroundColor: "#dbdbdb", border: "1px solid black", padding: "10px"}}>
                <Typography sx={{display: "inline", wordWrap: "break-word"}}>{comment.content}</Typography>
                <br></br>
                <Typography sx={{fontWeight: "bold", cursor: "grab", display: "inline"}} onClick={goToProfile}>@{comment.author.username} </Typography>
                <Typography>Created {DateTime.fromJSDate(new Date(comment.createdAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
            </Paper>
        )
    } else {
        return (
            <Paper sx={{margin: "10px", backgroundColor: "#dbdbdb", border: "1px solid black", padding: "10px"}}>
                <Typography sx={{display: "inline", wordWrap: "break-word"}}>{comment.content}</Typography>
                <br></br>
                <Typography sx={{fontWeight: "bold", cursor: "grab", display: "inline"}} onClick={goToProfile}>@{comment.author.username} </Typography>
                <Typography>Edited {DateTime.fromJSDate(new Date(comment.updatedAt)).toLocaleString(DateTime.DATETIME_MED)}</Typography>
            </Paper>
        )
    }
}

function ViewPost() {
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
            console.log("Error fetching post")
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
        if(localStorage.getItem("token")) { //if user is logged in return post and comments with the ability to post comments and edit post if the user owns it
            return ( 
                <Box sx={{display: "flex", flexDirection: "column", width: "100%", alignItems: "center"}}>
                    <Button sx={{marginTop: "10px"}} onClick={handleHomepage} variant="contained">Back to homepage</Button>
                    <PostInfo post={post} navigate={navigate}/>
                    <SendComment newComment={newComment} setNewComment={setNewComment} post={post}  navigate={navigate}></SendComment>
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
        } else { //if no user is logged in just return post and comments
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
export default ViewPost;