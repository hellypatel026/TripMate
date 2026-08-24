import { useEffect } from "react";
import socket from "../../services/socket";

function SocketTest() {

    useEffect(() => {

        socket.connect();

        const handleConnect = () => {
            console.log(
                "Connected to Socket.IO:",
                socket.id
            );
        };

        const handleDisconnect = () => {
            console.log("Disconnected from Socket.IO");
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        return () => {

            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);

            socket.disconnect();
        };

    }, []);

    return (
        <div>
            <h1>Socket.IO Test</h1>

            <p>
                Open the browser console.
            </p>
        </div>
    );
}

export default SocketTest;