
import { Button, TextField } from '@mui/material';
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
            
            <TextField id="outlined-basic" label="Comment" variant="outlined" onChange={(e) => setNewComment(e.target.value)}></TextField>
            <Button onClick={handleClick}>Send</Button>
            
        </div>
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
        } else if(res.status === 404) {
            
        }

    }

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [])



    if(post && comments) {
        if(localStorage.getItem("token")) {
            return (
                <div>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                    <p>Posted by: {post.owner.username}</p>
                    <h1>Post a comment</h1>
                    <SendComment newComment={newComment} setNewComment={setNewComment} postId={post._id}  navigate={navigate}></SendComment>
                    <h1>Comments</h1>
                    {comments.map(comment =>              
                        <h2 key={comment._id}>{comment.content} | By {comment.author.username}</h2>
                    )}   
                </div>
            )
        } else {
            return (
                <div>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                    <p>Posted by: {post.owner.username}</p>
                    
                    <h1>Comments</h1>
                    {comments.map(comment =>              
                        <h2 key={comment._id}>{comment.content} | By {comment.author.username}</h2>
                    )}   
                </div>
            )
        }
        
    } else {
        return (<h1>LOADING...</h1>)
        
    }
    
}
export default Viewpost;