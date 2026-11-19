'use strict';
/* ApkStart startup animation: receive progress from the main process and fade out */

const api = window.apkstartSplash;
if (!api) { /* Exit silently if the preload API was not injected */ }

const $ = (id) => document.getElementById(id);

// Version
api?.version?.().then((v) => { if ($('ver')) $('ver').textContent = v || ''; }).catch(() => {});

// First-run flag and whether runtime components are bundled
Promise.all([
  api?.isFirstRun?.().catch(() => false),
  api?.bundled?.().catch(() => false),
]).then(([first, bundled]) => {
  if (!first || !$('firstRun')) return;
  $('firstRun').hidden = false;
  // Bundled runtime (full installer / Microsoft Store MSIX): do not mention downloading.
  // Users should not be told to download a new image when the full installer already contains it;
  // only extraction to the user directory is needed, with no network connection.
  if (bundled) {
    if ($('firstRunTitle')) $('firstRunTitle').textContent = 'First launch · Preparing local files (no internet needed)';
    if ($('firstRunList')) {
      $('firstRunList').innerHTML = [
        '<li>Runtime components are included; nothing else needs to be downloaded</li>',
        '<li>Extract the system image to your user folder (approximately one minute, once only)</li>',
        '<li>Prepare hardware acceleration and input methods</li>',
        '<li>When ready, double-click an APK or desktop shortcut to launch an app</li>',
      ].join('');
    }
  }
}).catch(() => {});

// Progress update
api?.onProgress?.((p) => {
  if (!p) return;
  if (p.percent != null && $('progressBar')) {
    $('progressBar').style.width = Math.min(100, Math.max(0, p.percent)) + '%';
  }
  if (p.message && $('status')) {
    $('status').textContent = p.message;
  }
});

// Complete → fade out
api?.onDone?.(() => {
  const splash = $('splash');
  if (splash) {
    splash.classList.add('out');
    setTimeout(() => { api?.close?.(); }, 520);
  }
});
