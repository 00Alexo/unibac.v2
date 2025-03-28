require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const { createServer } = require('http');
const httpServer = createServer(app);
const userRoutes = require('./routes/userRoutes');
const minaAiRoutes = require('./routes/minaAiRoutes');
const subiecteRoutes = require('./routes/subiecteRoutes');
const classRoutes = require('./routes/classRoutes');
const triviaRoutes = require('./routes/triviaRoutes');

triviaRoutes(httpServer);

const allowedOrigin = [process.env.ALLOWED_ORIGIN, process.env.ORIGIN_TRIVIA] || 'http://localhost:3000';

const corsOptions = {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'username'],
    credentials: true
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) =>{
    console.log(req.path, req.method)
    if (req.url === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Wassup amigo');
    }
    next();
 })
app.use('/api/user', userRoutes)
app.use('/api/minaAi', minaAiRoutes);
app.use('/api/subiecte', subiecteRoutes);
app.use('/api/class', classRoutes);

 mongoose.connect(process.env.mongoDB)
 .then(() => {
     console.log("MongoDB connected");
 })
 .catch((error) => {
     console.error("MongoDB connection failed:", error);
}); 

httpServer.listen(process.env.PORT, () => {
    console.log('Server listening on port', process.env.PORT);
});