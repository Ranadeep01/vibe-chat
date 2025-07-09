const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');

const MONGODB_CONNECTION_STRING = 'mongodb+srv://ranadeepbashetty:Ranadeep%402002@random-chat-cluster.3n6oiie.mongodb.net/?retryWrites=true&w=majority&appName=random-chat-cluster';
// const MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017/chat_rooms';
    
const app = express();

app.use(express.json());
app.use(cors());

const messageSchema = new mongoose.Schema({
    userName: String,
    message: String,
})

let msg = 'hello ranadeep';

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.get('/', (req, res) => {
  res.send(msg);
});

app.get('/messages/:room', async (req, res) => {
    const messageModel = mongoose.model('Message', messageSchema, req.params.room);
    const messages = await messageModel.find({});
    res.send(messages);
});

mongoose.connect(MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  keepAlive: true
})
.then(() =>  
    console.log('Connected to MongoDB')
)
.catch(err => console.error(err));

const getMessageModel = (roomName) => {
  return mongoose.models[roomName] || mongoose.model(roomName, messageSchema, roomName);
};

io.on('connection', (socket) => {
  socket.on('message', async (data) => {
    try {
      const Message = getMessageModel(data.roomName);
      const msg = new Message(data);
      await msg.save();
      io.to(data.roomName).emit('message', data);
    } catch (err) {
      console.error('❌ Error saving message:', err.message);
    }
  });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('Server is running on port 5000');
});
