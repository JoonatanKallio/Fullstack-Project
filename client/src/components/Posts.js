import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ListPost({data, navigate}) {
    const handleClick = (id) => {
        navigate("/post/"+id)
    }
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
                {data.map(post => 
                    <h2 style={{cursor:'grab', width: "fit-content"}} onClick={() => handleClick(post._id)} key={post._id}>{post.title} | By {post.owner.username}</h2>
                )}
        </div>
    )
}

function Loggedin({data, navigate}) {
    const [newPost, setNewPost] = useState()
    const [title, setTitle] = useState()
    const createPost = async () => {
        const res = await fetch("/api/upload/post", {
            method: "POST",
            body: JSON.stringify({
                title: title,
                content: newPost
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
        <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
            <h1>Create a post</h1>
            <TextField id="outlined-basic" label="Title" variant="outlined" onChange={(e) => setTitle(e.target.value)}></TextField>
            <TextField id="outlined-basic" label="Post" variant="outlined" onChange={(e) => setNewPost(e.target.value)}></TextField>
            <Button onClick={createPost} style={{marginTop: 20}} variant="contained" color="primary">Create a post</Button>
            <h1>Current posts</h1>
            <ListPost data={data} navigate={navigate}/>
        </div>
    )
}

function Notloggedin ({data, navigate}) {
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
                <h1>Current posts</h1>
                <ListPost data={data} navigate={navigate}/>
        </div>
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