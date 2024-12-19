require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();


const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

const corsOptions = {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'username'],
    credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use((req, res, next) =>{
    console.log(req.path, req.method)
    if (req.url === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Wassup amigo');
    }
    next();
 })

 mongoose.connect(process.env.mongoDB)
 .then(() => {
     console.log("MongoDB connected");
 })
 .catch((error) => {
     console.error("MongoDB connection failed:", error);
}); 

app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT);
});