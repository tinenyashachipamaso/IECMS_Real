const socket = io('/');
// Logic for camera/mic control
let localStream;
async function init() {
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
}
function toggleMic() {
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
}
function toggleCam() {
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
}
init();