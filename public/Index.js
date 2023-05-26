const videoThing = document.getElementById('videoThing');
const options = document.getElementById('list');
const debug = document.getElementById('debugtext');
ShowDevice(); // Ask for camera access
navigator.mediaDevices.enumerateDevices() //Puts cameras in drop down menu
  .then(function(devices) {
    const cameras = devices.filter(device => device.kind === 'videoinput');
    cameras.forEach(function(camera) {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.text = camera.label;
      options.appendChild(option);
    });

    options.addEventListener('change', ShowDevice);
  })
  .catch(function(error) {
    console.error('Error enumerating devices:', error);
  });
function ShowDevice(chosen){
    let usedCamera = chosen;
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
        const rgb = getAverageCentreColour(2, width, height, rgbData);
        const colour = fromTuple(rgb);

        let box = document.getElementById("colourBox");
        box.setAttribute("style", "background-color:" + colour + ";");
        box.innerText = colour;
    })();
}, 0);

function getCentre(width, height){
    return [Math.floor(width/2), Math.floor(height/2)];
}

function getIndex(x, y, width){
    return (4 * (width * y + x));
}

function fromTuple(rgb){
  return fromRGB(rgb[0], rgb[1], rgb[2]);
}

function fromRGB(r, g, b){
    return ("#" + parseInt(r, 10).toString(16) + parseInt(g, 10).toString(16) + parseInt(b, 10).toString(16));
}

function getColour(index, rgbData){
    const r = rgbData.data[index];
    const g = rgbData.data[index + 1];
    const b = rgbData.data[index + 2];
    return [r, g, b];
}

function getCentreColour(width, height, rgbData){
    const middle = getCentre(width, height)
    return getColour(getIndex(middle[0], middle[1], width), rgbData);
}

function getAverageCentreColour(radius, width, height, rgbData){
    let half = Math.floor(radius/2);
    let area = radius*radius;
    let centre = getCentre(width, height);
    let r = 0;
    let g = 0;
    let b = 0;
    for (let x = -half; x < half; x++){   
        for (let y = -half; y < half; y++){ 
            let xPos = centre[0] + x;   
            let yPos = centre[1] + y;
            let colour = getColour(getIndex(xPos, yPos, width), rgbData);
            r += colour[0];
            g += colour[1];
            b += colour[2];
        }
    }
    r /= area;
    g /= area;
    b /= area;
    return [Math.floor(r), Math.floor(g), Math.floor(b)];
}