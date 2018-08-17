const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const TLV = require('node-tlv');
const coap = require('coap')
coap.registerFormat('application/vnd.oma.lwm2m+tlv', 11542);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow()

  win.maximize();

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  /**
 * 处理前端的消息请求
 */

  ipcMain.on('icpRequest', (event, arg) => {
    console.log(arg)
    sendCoapRequest(event, arg)
  })
}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const template = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() { require('electron').shell.openExternal('https://electronjs.org') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })

  // Window menu
  template[3].submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  ]
}



const sendCoapRequest = async (event, request) => {
  let coapOptions = {
    args: generateArgs(request),
    body: request.body
  }
  rs = await handleCoapRequest(coapOptions);
  event.sender.send('icpResponse', rs)
}


const generateArgs = (ctxRequestBody) => {
  let urlStr = ctxRequestBody.url.replace('coap','http'); //Replace 'coap' to 'http' to use 'url' node_module.
  const URL = url.parse(urlStr);
  return {
      hostname: URL.hostname,
      port: URL.port ? URL.port : 5683,
      pathname: URL.pathname,
      method: ctxRequestBody.method,
      headers: ctxRequestBody.headers ? ctxRequestBody.headers : null,
      query: URL.search ? URL.search : null,
  };
}

const handleCoapRequest =  (coapOptions) => {
  console.log('-------------------coap request info----------------------- \n',coapOptions)

  const promise = new Promise(function(resolve, reject) {
      try {
          let req = coap.request(coapOptions.args);
          if (coapOptions.body) {
              if(coapOptions.args.method == 'post'){
                  let t = TLV.parse(coapOptions.body);
                  req.write(Buffer.from(t).toString());
              }else{
                  req.write(JSON.stringify(coapOptions.body));
              }
          }
          req.on('response', function (res) {
              let rs = {
                  payload: Buffer.from(res.payload).toString(),
                  options: res.options,
                  headers: res.headers,
                  code: res.code,
                  method: res.url,
                  rsinfo: res.rsinfo,
                  outSocket: res.outSocket
              }
              console.log('-----------------------coap response payload--------------------- \n',rs);
              resolve(rs);
          })
          req.on('error',function(err){
              reject(err);
          })
          req.end();
      } catch (error) {
          reject(error);
      }

  });
  return promise;
}
