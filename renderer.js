// Add some IPC message logging
//

require('electron').ipcRenderer.on('ping', (event, message) => {
  console.log(message);
});

