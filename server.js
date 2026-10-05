const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const session = require('express-session');
const { v4: uuidV4 } = require('uuid');

// 1. App Configuration
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// 2. Session Setup
app.use(session({
    secret: 'jsc-judicial-secret-2026',
    resave: false,
    saveUninitialized: true
}));

// 3. Helper: Auth Middleware
const auth = (req, res, next) => {
    if (req.session.user) next();
    else res.redirect('/login');
};

// 4. Routes
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
    // Simple demo auth: Any username works for your research demo
    req.session.user = req.body.username;
    res.redirect('/dashboard');
});

app.get('/dashboard', auth, (req, res) => {
    res.render('dashboard');
});

// Create Session: Prompts for details then goes to Pre-Join
app.post('/create-session', auth, (req, res) => {
    const { caseNumber, judge, participants, date } = req.body;
    const roomId = uuidV4();
    // Store in session to display in pre-join
    req.session.sessionDetails = { caseNumber, judge, participants, date };
    res.render('pre-join', { roomId, caseNumber });
});

// Join session by link
app.get('/join/:roomId', (req, res) => {
    res.render('pre-join', { roomId: req.params.roomId, caseNumber: 'External Guest' });
});

// Enter the Courtroom
app.get('/room/:roomId', (req, res) => {
    res.render('room', { roomId: req.params.roomId });
});

// 5. Socket.io for Real-time Video/Audio Signaling
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    });
});

// 6. Server Start (Dynamic Port for Render)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`IECMS System live on port ${PORT}`);
});