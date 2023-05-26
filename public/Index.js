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
        ctx.drawImage($this, 0,0, width, height);
        setTimeout(loop, frameTime); // drawing at 30fps
        let rgbData = ctx.getImageData(0, 0, width, height); // x = 0; y = 0; w = width; h = height;
        const middle = rgbData.data.length/2 - width*2; // *2 becaus every pixel has four entries (rgba)
        const r = rgbData.data[middle];
        const g = rgbData.data[middle + 1];
        const b = rgbData.data[middle + 2];
        const colour = "#" + parseInt(r, 10).toString(16) + parseInt(g, 10).toString(16) + parseInt(b, 10).toString(16);
        let message = "R: " + r + ", G: " + g + ", B: " + b;
        message = '%c'.concat (message);
        console.log("R: " + r + ", G: " + g + ", B: " + b);
        console.log(message, ('color: '+ colour));

        ctx.putImageData(rgbData, 0, 0);
    })();
}, 0);
