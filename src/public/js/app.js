const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let captureStream;
let muted = false;
let cameraOff = false;

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind ==='videoinput');
        console.log(devices);
        const currentCamera = captureStream.getVideoTracks()[0];
        cameras.forEach(camera=>{
            const options = document.createElement("option")
            options.value = camera.deviceId;
            options.innerText = cameras.label;
            if(currentCamera.label == camera.label){
                options.selected = true;
            }
            cameraSelect.appendChild(options);
        });        
    }catch(e){
        console.log(e);
    }
}

async function getMedia(deviceId){
    const initialConstraints = {
        audio:true,
        video:{facingMode:"user"},
    };
    const cameraConstraints = {
        audio:true,
        video:{
            deviceId:{exact:deviceId}
        },
    };
    const displayConstraints = {
        video: {
            cursor: "always"
        },
        audio: true
    };
    try{
        captureStream = await navigator.mediaDevices.getDisplayMedia(displayConstraints);
        myFace.srcObject = captureStream;
        console.log(captureStream);
        if(!deviceId){
            await getCameras();
        }
    } catch (e) {
        console.log(e);
    }
}

getMedia();

function handleMuteClick(){
    console.log(captureStream.getAudioTracks());
    captureStream.getAudioTracks().forEach(track => { track.enabled = !track.enabled;});
    if(!muted){
        muteBtn.innerText="Unmute";
    } else {
        muteBtn.innerText="Mute";
    }
    muted = !muted;
}
function handleCameraClick(){
    console.log(captureStream.getVideoTracks());
    captureStream.getVideoTracks().forEach(track => { track.enabled = !track.enabled;});
    if(cameraOff){
        cameraBtn.innerText="Turn Camera Off";
    } else {
        cameraBtn.innerText="Turn Camera On";
    }
    cameraOff = !cameraOff;
}

async function handleCameraChange(){
    console.log(cameraSelect.value);
    await getMedia(cameraSelect.value);
}

muteBtn.addEventListener("click",handleMuteClick);
cameraBtn.addEventListener("click",handleCameraClick);
cameraSelect.addEventListener("input",handleCameraChange);