'use strict'

window.SSHClient = require('ssh2').Client
window.SSH2shell = require('ssh2shell')

const { remote } = require('electron')
const Menu = remote.Menu

const path = require('path')
const { readFileSync, writeFileSync, createReadStream } = require('fs')
window.readFileSync = readFileSync
window.writeFileSync = writeFileSync
window.createReadStream = createReadStream

// CLOSE THE ELECTRON-WINDOW:
const currWindow = remote.getCurrentWindow()

window.closeApp = () => {
    currWindow.close()
}

// FLASH IN TASKBAR:
window.flashWindow = () => {
    currWindow.flashFrame(true)
}

// GET APP-TEMP PATH:
window.tempPath = remote.app.getPath("temp")

// GET VERSION OF THE APP:
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
    frameElement.classList.add('hide')
    const container_HTML = document.getElementById('container')
    container_HTML.insertAdjacentElement('afterbegin', frameElement)
}
window.loadFrame = loadFrame

function setActiveFrame(frameName) {
    frameSites[currentFrame] && (document.getElementById(frameSites[currentFrame]).classList.add('hide'))
    currentFrame = Number(Object.keys(frameSites).find(key => frameSites[key] === frameName))
    document.getElementById(frameName).classList.remove('hide')
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
