const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const session = require('express-session');
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'jsc-secret', resave: false, saveUninitialized: true }));

const activeSessions = {}; // Store sessions in memory

app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => { req.session.user = req.body.username; res.redirect('/dashboard'); });

app.get('/dashboard', (req, res) => res.render('dashboard', { user: req.session.user }));

app.post('/create-session', (req, res) => {
    const roomId = uuidV4();
    activeSessions[roomId] = {
        moderator: req.session.user,
        case: req.body.caseNumber,
        participants: []
    };
    res.redirect(`/pre-join/${roomId}`);
});

app.get('/pre-join/:roomId', (req, res) => res.render('pre-join', { roomId: req.params.roomId }));
app.get('/room/:roomId', (req, res) => res.render('room', { roomId: req.params.roomId, session: activeSessions[req.params.roomId] }));

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);