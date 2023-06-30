const {app, BrowserWindow, dialog, ipcMain} = require("electron")
const {path} = require("path")
const {platformpath} = require("./utils")

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		autoHideMenuBar: true,
		resizable: false,
		width: 430,
		height: 590,
		useContentSize: true,
		maximizable: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})

	// and load the index.html of the app.
	mainWindow.loadFile("index.html")

	// Open the DevTools for debugging, only if not in production.
	if (!app.isPackaged) {
		mainWindow.webContents.openDevTools({mode: "detach"})
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow()

	app.on("activate", () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit()
})


ipcMain.on("pick-path", (event) => {
	// If the platform is 'win32' or 'Linux'
	// Resolves to a Promise<Object>
	dialog.showOpenDialog({
		title: "Select the Path where the game will be downloaded to",
		defaultPath: platformpath(),
		buttonLabel: "Select",
		// Specifying the Directory Selector Property
		properties: ["openDirectory"]
	}).then(file => {
		// Stating whether dialog operation was
		// cancelled or not.
		console.log(file.canceled)
		if (!file.canceled) {
			const filepath = file.filePaths[0].toString()
			console.log(filepath)
			event.reply("file", filepath)
		}
	}).catch(err => {
		console.log(err)
	})
})