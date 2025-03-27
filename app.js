const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.set('views','views');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const {mongoConnect} = require('./util/database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'view')));

// Import routers
const userRouter = require('./Router/user-router');
const hostRouter = require('./Router/host-router')
const bookingsRouter = require('./routes/bookings');

// Routes
app.use(userRouter);
app.use(hostRouter);
app.use(bookingsRouter);

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: { email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed' 
        });
    }
});

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
       
        res.json({ 
            success: true, 
            message: 'Registration successful',
            user: { name, email, phone }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Registration failed' 
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const port = process.env.PORT || 3000;
mongoConnect(()=>{
app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
});
})