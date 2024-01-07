import { Typography } from "@mui/material";

function Notifications({ notifs }) {
    if (notifs) {
        return (
            <Typography sx={{
                fontSize: "18px", backgroundColor: "#ff7961", borderRadius: "10px", padding: "5px", margin: "10px", width: "fit-content",
            }}
            >
                {notifs}
            </Typography>
        );
    }
}
export default Notifications;
