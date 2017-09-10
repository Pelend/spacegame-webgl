///
// FILE   : main.js
// BRIEF  : SpaceGame WebGL application main

const electron = require('electron')
const gameClient = require('./gameclient.js);

// Module to control application life.
const { app, protocol } = require('electron')

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep the references around so we don't get ganked by the garbage colletor
let mainWindow
let pingInterval
let appState
let gameClient


function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.setMenu(null);
  mainWindow.setTitle("SpaceGame Client");

  mainWindow.loadURL(url.format({
    pathname: 'index.html',
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// Wait for Electron to boot up, then create main window
app.on('ready', () => {

  // Intercept the 'file' protocol so we can serve static content without using express etc. 
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr(7)    /* all urls start with 'file://' */
    callback({ path: path.normalize(`${__dirname}/${url}`)})
  }, (err) => {
    if (err) console.error('Failed to register protocol')
  })
  createWindow()


  // We are now in the main menu
  appState = "main_menu";
})


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})



