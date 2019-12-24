const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error)
        process.exit(1)
    })

function getInstallerConfig() {
    console.log('creating windows installer')
    const rootPath = path.join('./')
    const outPath = path.join(rootPath, 'release-builds')

    return Promise.resolve({
        appDirectory: path.join(outPath, 'MonitorCampanas-win32-ia32/'),
        authors: 'Spartacus inc',
        noMsi: true,
        outputDirectory: path.join(outPath, 'windows-installer'),
        exe: 'MonitorCampanas.exe',
        setupExe: 'MonitorCampanasInstaller.exe',
        setupIcon: path.join(rootPath, 'assets', 'icons', 'favi.ico')
    })
}