# ApkStart

<p align="center"><img src="docs/images/logo.png" alt="ApkStart logo" width="160" /></p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11%20x64-0078D6.svg)](#)

**Run Android APKs as separate applications on Windows, with individual windows and desktop shortcuts.**

ApkStart is a free, open-source experimental app originally developed by [RoutineMiku](https://github.com/RoutineMiku/apkstart). This English-localized fork is maintained at [Ajayraj2126/apkstart](https://github.com/Ajayraj2126/apkstart).

## Features

- **Double-click APKs to install:** Associate `.apk` files with ApkStart to install directly from File Explorer.
- **Desktop and Start menu shortcuts:** Each Android app gets its own icon and launch command.
- **Separate app windows:** Use embedded or detached window modes, resize an app, or press **F11** for fullscreen.
- **Android runtime management:** Download and manage the Android Emulator, Android 14 system image, adb, and virtual device automatically.
- **Adaptive performance:** Detect available memory, CPU, graphics, hardware acceleration, and disk space.
- **File sharing:** Synchronize `%USERPROFILE%\ApkStartShared` with Android's `/sdcard/ApkStartShared`.
- **Diagnostics and repair:** Troubleshoot acceleration, network, startup failures, missing components, and desktop shortcuts.

## Downloads

The original project publishes releases on [GitHub](https://github.com/RoutineMiku/apkstart/releases) and [Gitee](https://gitee.com/daily-miku/apkstart/releases).

**Those are upstream releases and do not include the changes in this English-localization branch.** Build from this branch for the translated UI.

| Edition | Typical filename | Description |
|---|---|---|
| Microsoft Store | `ApkStart_<version>_x64.msix` | Store-managed installation and updates |
| Full portable | `ApkStart-v*-win64-full.zip` | Portable package with bundled Android runtime |
| Windows installer | `ApkStart-v*-Setup.exe` | NSIS setup with shortcuts and uninstall support |
| Lightweight portable | `ApkStart-v*-win64-portable.zip` | Smaller package; downloads the runtime on first use |

## Build from source

Use Windows 10/11 x64 with Node.js 20 or later. From a PowerShell terminal in the repository:

```powershell
npm install
npm start
```

Open **Settings → Runtime and Environment → Set Up Automatically** on first launch.

Optional commands:

```powershell
npm run assoc:on         # Register .apk file association
npm run assoc:off        # Remove association
npm run pack             # Lightweight portable build
npm run pack:full        # Full portable build
npm run runtime          # Prepare bundled runtime files
npm run build:exe        # NSIS Windows installer
npm run build:msix       # MSIX edition
npm test                 # Run automated tests
npm run selftest         # Test an installed runtime
```

Build outputs are placed under the `dist/` directory. Full packages require sufficient disk space for Android runtime files. Refer to `package.json` and `electron-builder.yml` for configuration.

## How launching works

```text
Double-click APK → Parse metadata → Install into Android
                 → Create desktop / Start menu shortcut

Double-click shortcut → ApkStart.exe --launch <package>
                      → Start or reuse the Android runtime
                      → Start the app's Android LAUNCHER activity
                      → Show the app in its own window
```

ApkStart reads `AndroidManifest.xml` to select a portrait or landscape panel. It may restart the shared runtime once when switching orientation. Tablet layout is controlled by Android display density.

## English language settings

New installations default to **English (United States)** and the Android English keyboard. In the app, use **Settings → Performance and Resource Usage → System Language** to change the Android guest language. Restart the Android runtime after changing this option.

Existing installations may retain previously saved Chinese-language preferences in `settings.json`; select English manually if needed. The optional Pinyin input method remains available.

## Performance and troubleshooting

The Android runtime may use Windows Hypervisor Platform (WHPX) or AEHD for acceleration, and falls back to slower software emulation when necessary. To enable WHPX, turn on **Windows Hypervisor Platform** in Windows Features and restart the computer. Alternatively, in an administrator PowerShell terminal:

```powershell
dism /online /enable-feature /featurename:HypervisorPlatform /all /norestart
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**Runtime missing or not starting?** Use Settings → Runtime and Environment → Set Up Automatically, then Export Diagnostics if necessary.

**No network inside Android?** Use Settings → Repair Network. Read the confirmation carefully, because some repair paths reset Android app data.

**Desktop app icon is wrong?** Use Settings → Desktop and Apps → Rebuild Shortcuts.

**Android storage is full?** Increase the data partition size in Performance and Resource Usage. **Reset Android Data deletes installed app data**.

**adb cannot see ApkStart?** ApkStart uses a dedicated adb server on port **5044** rather than 5037:

```powershell
$env:ANDROID_ADB_SERVER_PORT = 5044
adb devices
```

Avoid connecting manually to emulator port 5555 unless debugging requires it; Android may show a USB-debugging permission prompt.

## Project layout

```text
src/main.js        Electron main process: windows, tray and IPC
src/preload.js     Secure renderer bridge
src/ui/           Application HTML, CSS and JavaScript
src/core/         APK parser, Android runtime, adb, storage and installers
build/            Portable / installer / MSIX packaging
scripts/          Utility scripts
test/             Automated and integration tests
docs/             Architecture and troubleshooting documentation
```

CLI usage:

```text
ApkStart.exe                     Open the app
ApkStart.exe <path-to-apk>       Install an APK
ApkStart.exe --launch <package>  Launch an installed app
```

Tests:

```powershell
npm test
npm run test:boot
npm run selftest
electron test/electron-integration.js
electron . --smoke test\shot.png
```

## Credits and license

ApkStart was created by **RoutineMiku**. See the [original repository](https://github.com/RoutineMiku/apkstart) for upstream history and [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

This repository uses the [MIT License](LICENSE). Android, QEMU, Google tools and other runtime components have separate licenses.