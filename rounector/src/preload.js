'use strict'

window.SSHClient = require('ssh2').Client
window.SSHClient2 = require('node-ssh')

const { remote } = require('electron')
const Menu = remote.Menu

const path = require('path')
const { readFileSync } = require('fs')

// CLOSE THE ELECTRON-WINDOW:
const currWindow = remote.getCurrentWindow()

window.closeApp = function() {
    currWindow.close()
}

//GET VERSION OF THE APP:
window.appVersion = remote.app.getVersion()

// SET DIALOG TO GLOBAL:
window.dialog = remote.dialog

// Declare the https module:
// window.requests = require('https')  // TODO!!!
window.requests = require('http')

// Frames:
// Define the frames:
window.frameSites = {}
// Define the frame functions:
window.frameFunctions = {}

let currentFrame

function loadFrame(filename) {
    const frameHTML = readFileSync(path.join(__dirname, "/interface/", filename + ".html"), 'utf-8')
    const dummyEl = document.createElement('div')
    dummyEl.innerHTML = frameHTML
    const frameElement = dummyEl.firstChild
    frameElement.hidden = true
    const container_HTML = document.getElementById('container')
    container_HTML.insertAdjacentElement('afterbegin', frameElement)
}
window.loadFrame = loadFrame

function setActiveFrame(frameName) {
    frameSites[currentFrame] && (document.getElementById(frameSites[currentFrame]).hidden = true)
    currentFrame = Number(Object.keys(frameSites).find(key => frameSites[key] === frameName))
    document.getElementById(frameName).hidden = false
    frameFunctions[frameName]()
}
window.setActiveFrame = setActiveFrame

function loadFrameNext() {
    setActiveFrame(frameSites[currentFrame + 1])
}
window.loadFrameNext = loadFrameNext

function loadFrameBack() {
    setActiveFrame(frameSites[currentFrame - 1])
}
window.loadFrameBack = loadFrameBack

// SelectionMenu for input:
const selectionMenu = Menu.buildFromTemplate([
    {role: 'copy'},
    {type: 'separator'},
    {role: 'selectall'},
])

const inputMenu = Menu.buildFromTemplate([
    {role: 'undo'},
    {role: 'redo'},
    {type: 'separator'},
    {role: 'cut'},
    {role: 'copy'},
    {role: 'paste'},
    {type: 'separator'},
    {role: 'selectall'},
])

currWindow.webContents.on('context-menu', (e, props) => {
    const { selectionText, isEditable } = props
    if (isEditable) {
      inputMenu.popup(currWindow)
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup(currWindow)
    }
})

const Rounector = require('./Rounector')

window.rounector = new Rounector()
