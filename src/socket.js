import io from "socket.io-client";

const SOCKET_URL = `http://localhost:5000`;
// const SOCKET_URL = `https://qarshi-med.vercel.app/api`;
const headers = { transports: ["websocket"] };
const socket = io(SOCKET_URL, headers);

export default socket;
