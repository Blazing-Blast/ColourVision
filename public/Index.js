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
