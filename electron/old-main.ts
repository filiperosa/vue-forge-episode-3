import { app, BrowserWindow } from 'electron'
import { fork } from 'child_process'
import path from 'path'

// import { createServer } from 'http';
// import { Nuxt, Builder } from 'nuxt';
// const nuxtConfig = require('./nuxt.config.js') as NuxtConfig;
// const nuxt = new Nuxt(nuxtConfig);
// new Builder(nuxt).build();
// const server = createServer(nuxt.render);
// server.listen(3000, 'localhost');

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ ├─┬ renderer
// │ │ └── index.html

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, 'public')
  : path.join(process.env.ROOT, '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow
const preload = path.join(process.env.DIST, 'preload.js')

function bootstrap() {
  win = new BrowserWindow({
    width: 800,
    height: 1110,
    webPreferences: {
      preload,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
  }

  // const entryPoint = '.output/server/index.mjs'
  // fork(entryPoint)
  // //win.loadFile('.output/public/index.html')
  // win.loadURL('http://[::]:3000')
  // console.log("LOADING FILE: "+entryPoint)
}

app.whenReady().then(bootstrap)
