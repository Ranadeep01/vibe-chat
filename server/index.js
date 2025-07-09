const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');

const MONGODB_CONNECTION_STRING = 'mongodb+srv://ranadeepbashetty:Ranadeep%402002@random-chat-cluster.3n6oiie.mongodb.net/?retryWrites=true&w=majority&appName=random-chat-cluster';
    
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
        origin: 'http://localhost:3000',
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

mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() =>  
    console.log('Connected to MongoDB')
)
.catch(err => console.error(err));

io.on('connection', (socket) => {

    socket.on('join', (data) => {
        socket.join(data);
        console.log('joined room: ', data);
        
    })
    
    socket.on('message', (data) => {
        const messageModel = mongoose.model('Message', messageSchema, data.roomName);
        console.log(data);
        const msg = new messageModel(data); 
        const res = msg.save();
        io.to(data.roomName).emit('message', data);
    });

    
    // io.to(data.roomName).emit('message', data);
})  

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
