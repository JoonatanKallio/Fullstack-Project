import { Box, Button, Typography } from "@mui/material";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from "react-router-dom";
import Notifications from "./Notifications";

function EditPost() {
    const navigate = useNavigate();
    const routeParam = useParams().postId;
    const [post, setPost] = useState();
    const [editorState, setEditorState] = useState(EditorState.createEmpty(null));
    const [notification, setNotification] = useState();

    const fetchPost = async () => { // Fetch to get post data by postId
        const res = await fetch(`/api/list/post/${routeParam}`);
        if (res.status === 200) {
            const data = await res.json();
            setPost(data);
        } else if (res.status === 404) {
            console.log("Error in the fetch.");
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    useEffect(() => { // Sets editor state after post has been initialized so post has data to fill the text editor with
        if (post) {
            const json = JSON.parse(post.content);
            setEditorState(EditorState.createWithContent(convertFromRaw(json)));
        }
    }, [post]);

    // eslint-disable-next-line no-shadow
    function onEditorStateChange(editorState) { // Changes the wysiwyg editor's state
        setEditorState(editorState);
    }

    const handleClick = async () => { // Handles "save edit" click
        const raw = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        console.log(raw);
        const res = await fetch("/api/edit/post", {
            method: "PUT",
            body: JSON.stringify({
                id: post._id,
                content: raw,
            }),
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (res.status === 200) { // If edit successful, navigate back to the post
            navigate(`/post/${post._id}`);
        } else {
            setNotification("Editing failed, relog and try again.");
        }
    };

    const handleCancel = () => {
        navigate(`/post/${post._id}`);
    };

    return ( // Returns editor with the post contents inside ready to edit
        <Box sx={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", marginTop: "10px",
        }}
        >
            <Typography sx={{ fontSize: "32px" }}>Edit your post</Typography>
            <Box sx={{ width: { xs: "90%", sm: "60%" } }}>
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    /* eslint-disable-next-line react/jsx-no-bind */
                    onEditorStateChange={onEditorStateChange}
                    toolbar={{
                        options: ["blockType", "inline", "fontSize", "list"],
                        inline: { inDropdown: true },
                        fontsize: { inDropdown: true },
                        blockType: { inDropdown: true },
                        list: { inDropdown: true },
                    }}
                />
            </Box>
            <Notifications notifs={notification} />
            <Box>
                <Button className="save-post-edit" onClick={handleClick}>Save edit</Button>
                <Button onClick={handleCancel}>Cancel</Button>
            </Box>
        </Box>
    );
}
export default EditPost;
