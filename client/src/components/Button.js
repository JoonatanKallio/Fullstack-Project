
function Button() {
    const hancleClick = (e) => {
        const token = localStorage.getItem("token")
        console.log(token)
        fetch("/api/secret", {
            headers: new Headers({
                'Authorization': "Bearer " + token, 
            }), 
        })
        .then(res => res.json())
        .then(data => console.log(data))
    } 
    return (
        <button onClick={hancleClick}>TESTR</button>
    )
}
export default Button;