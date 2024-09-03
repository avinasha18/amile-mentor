import { io } from "socket.io-client";
import { api } from "../../hooks/apis";

const socket = io(api);


export default socket;