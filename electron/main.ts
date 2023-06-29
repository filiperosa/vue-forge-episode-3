import { app, BrowserWindow } from 'electron'
import { APP_NAME } from '../constants'
// const path = require('path');

app.name = APP_NAME

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 800,
        height: 1110,
        // webPreferences: {
        //   preload: path.join(__dirname, 'preload.js'),
        // },
    });
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
})