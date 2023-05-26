const videoThing = document.getElementById('videoThing');
const options = document.getElementById('list');
const debug = document.getElementById('debugtext');
ShowDevice(); // Ask for camera access
navigator.mediaDevices.enumerateDevices() //Puts cameras in drop down menu
  .then(function(devices) {
    const cameras = devices.filter(device => device.kind === 'videoinput');
    cameras.forEach(function(camera) {
      console.log(cameras);
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.text = 'Camera ' + (options.length + 1);
      options.appendChild(option);
    });

    options.addEventListener('change', ShowDevice);
  })
  .catch(function(error) {
    console.error('Error enumerating devices:', error);
  });
function ShowDevice(){
    const usedCamera = options.value;
    navigator.mediaDevices.getUserMedia({ video: { deviceId: usedCamera } })
    .then(function(stream) {
     videoThing.srcObject = stream;
    })
    .catch(function(error) {
        console.error('Error accessing camera:', error);
      });
}

var canvas = document.getElementById('videoCanvas');
var ctx    = canvas.getContext('2d');
const frameTime = 1000/30;

videoThing.addEventListener('loadedmetadata', function() {
  canvas.width = videoThing.videoWidth;
  canvas.height = videoThing.videoHeight;
});

videoThing.addEventListener('play', function () {
    const width = videoThing.videoWidth;
    const height = videoThing.videoHeight;
    var $this = this; //cache
    (function loop() {
        ctx.drawImage($this, 0,0, canvas.width, canvas.height);
        setTimeout(loop, frameTime); // drawing at 30fps
        const rgbData = ctx.getImageData(0,0,canvas.width, canvas.height).data; // x = 0; y = 0; w = width; h = height;
        const middle = 4*(width * (height/2 + 1));
        const r = rgbData[middle];
        const g = rgbData[middle + 1];
        const b = rgbData[middle + 2];
        console.log("R: " + r + ", G: " + g + ", B: " + b);
        for (i=0; i < middle; 1++){
          rgbData[i] = 255;
          rgbData[i] = 0;
          rgbData[i] = 200;
        }
    })();
}, 0);
