import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const handleClick = (id) => {
        navigate("/post/"+id)
    }

    return (
        <>
            <h2>Current posts</h2>
            <ul>
                {data.map(post => 
                    <li onClick={() => handleClick(post._id)} key={post._id}>User: {post.owner.username} | {post.title}</li>
                )}
            </ul>
        </>
    )
}
export default Posts;