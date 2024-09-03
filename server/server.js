import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connectToMongoDB } from './db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import chatRoutes from './routes/chattingRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});
app.use(cors({
  origin: "http://localhost:5174",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(bodyParser.json());
app.use("/", mentorRoutes);
app.use('/', chatRoutes(io));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('sendMessage', ({ room, chat, message }) => {
    io.to(room).emit('receiveMessage', { chat, message });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

connectToMongoDB();
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
