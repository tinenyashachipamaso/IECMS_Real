const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const session = require('express-session'); // Required for login

app.use(session({ secret: 'judicial-secret', resave: false, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Auth Check Middleware
const auth = (req, res, next) => {
    if (req.session.user) next();
    else res.redirect('/login');
};

app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
    req.session.user = req.body.username; // Simple demo login
    res.redirect('/dashboard');
});

app.get('/dashboard', auth, (req, res) => res.render('dashboard'));

// The Session Creation
app.post('/create-session', auth, (req, res) => {
    const roomId = Math.random().toString(36).substring(7);
    // Store session info (In production, use a database like MongoDB)
    req.session.lastRoom = { ...req.body, roomId };
    res.render('pre-join', { roomId, type: 'creator' });
});

app.get('/join/:roomId', (req, res) => {
    res.render('pre-join', { roomId: req.params.roomId, type: 'guest' });
});

server.listen(3000);