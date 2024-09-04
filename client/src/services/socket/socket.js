import { io } from "socket.io-client";
import { socketapi } from "../../hooks/apis";

const socket = io(socketapi);


export default socket;