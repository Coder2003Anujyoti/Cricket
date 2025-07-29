// socket.js
import { io } from "socket.io-client";
export const socket = io("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/",{
  transports: ["websocket"], }); // or your backend URL