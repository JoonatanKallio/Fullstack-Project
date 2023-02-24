import { Box, Button } from '@mui/material';

import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from 'react-router-dom';


function Editpost() {
    const navigate = useNavigate()
    const routeParam = useParams().postId
    const [post, setPost] = useState()
    const [editorState, setEditorState] = useState(EditorState.createEmpty(null))

   
    const fetchPost = async () => {
        const res = await fetch("/api/list/post/"+routeParam)
        if(res.status === 200) {
            const data = await res.json();
            setPost(data)
        } else if(res.status === 404) {   
            //HANDLE
        }
    }


    useEffect(() => {
        fetchPost()
    }, [])

    
    useEffect(() => {
        if(post) {
            const json = JSON.parse(post.content);
            const html = draftToHtml(json)
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(html))));
        }   
        
    }, [post]);
      
    
    
    function onEditorStateChange (editorState) {
        setEditorState(editorState)
    }

    const handleClick = async () => {
        const raw = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        console.log(raw)
        const res = await fetch("/api/edit/post", {
            method: "PUT",
            body: JSON.stringify({
                id: post._id,
                content: raw
            }),
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        })

        if(res.status === 200) {
            const data = await res.json()
            navigate("/post/"+ post._id)
            
        }
    }

    return (
        <Box sx={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Box sx={{width: "60%"}}>
                    <Editor
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChange}
                    />
            </Box>
            <Button onClick={handleClick}>Save edit</Button>
        </Box>
    )
    

    
        
        

    
    
}
export default Editpost;