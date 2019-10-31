import rounectorWindows from '../files/rounector/windows/Rounector.exe'
import rounectorMac from '../files/rounector/mac/Rounector.dmg'


const filePaths = {
  'windows': rounectorWindows,
  'mac': rounectorMac,
}

const platforms = {
  'windows': [
    'Windows',
    'Win16',
    'Win32',
    'Win64',
    'WinCE',
  ],
  'mac': [
    'Macintosh',
    'MacIntel',
    'MacPPC',
    'Mac68K',
  ]
}

function rounectorFile() {
  let filePath

  Object.keys(platforms).forEach(platform => {
    platforms[platform].includes(navigator.platform)
    && (filePath = filePaths[platform])
  })
  
  return filePath
}


export default rounectorFile()
