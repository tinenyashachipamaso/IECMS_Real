const socket = io('/');
const myVideo = document.createElement('video');
navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
    myVideo.srcObject = stream;
    myVideo.play();
    document.getElementById('speaker-video').srcObject = stream;
});

function toggleMic() { /* logic */ }
function toggleCam() { /* logic */ }

function endSession() {
    alert("Moderator ended the session.");
    window.location.href = '/dashboard';
}