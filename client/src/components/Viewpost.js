import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Viewpost() {
    const [post, setPost] = useState("")
    const [comments, setComments] = useState("")
    const routeParam = useParams().postId

    const fetchPost = async () => {
        const res = await fetch("/api/list/post", { //VVAIHA TÄHÄN REQ PARAMS
            method: "POST",
            body: JSON.stringify({"id": routeParam}),
            headers: {"Content-Type": "application/json"}
        })

        if(res.status === 200) {
            const data = await res.json();
            setPost(data)
        } else if(res.status === 404) {   
            
        }
    }

    const fetchComments = async () => {
        const res = await fetch("/api/list/comments", {
            method: "POST",
            body: JSON.stringify({"id": routeParam}),
            headers: {"Content-Type": "application/json"}
        })
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
        return (
            <>
                <h2>POST BY {post.owner.username}</h2>
                <h1>{post.title}</h1>
                <p>{post.content}</p>
                <h1>Comments</h1>
                <ul>
                    {comments.map(comment => 
                    <li key={comment._id}>Username: {comment.author.username} | Comment: {comment.content}</li>
                    )}
                </ul>
                
            </>
        )
    } else {
        return (<h1>LOADING...</h1>)
        
    }
    
}
export default Viewpost;