const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// load video.js source and convert export default to a normal function
const videoSrcPath = path.resolve(__dirname, '..', 'blocks', 'video', 'video.js');
let src = fs.readFileSync(videoSrcPath, 'utf8');
// replace `export default function decorate(block) {` with `function decorate(block) {`
src = src.replace(/export\s+default\s+function\s+decorate\s*\(/, 'function decorate(');
// append expose to window
src += '\nwindow.decorate = decorate;\n';

// prepare a minimal HTML with a video block
const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<div id="root">
  <div class="video">
    <div>
      <div><a>https://www.youtube.com/watch?v=dQw4w9WgXcQ</a></div>
    </div>
    <div data-position="center" data-cta="/shop" data-ctatext="Buy Now"></div>
  </div>
</div></body></html>`;

const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
const { window } = dom;

// inject the transformed decorate source into the JSDOM environment
const scriptEl = window.document.createElement('script');
scriptEl.textContent = src;
window.document.head.appendChild(scriptEl);

// wait briefly for scripts to load
setTimeout(() => {
  const block = window.document.querySelector('.video');
  if (!block) {
    console.error('video block not found');
    process.exit(2);
  }

  try {
    // call decorate exported as window.decorate
    window.decorate(block);
  } catch (e) {
    console.error('decorate threw:', e);
    process.exit(3);
  }

  // inspect overlay
  const overlay = block.querySelector('.video-overlay');
  if (!overlay) {
    console.error('overlay not created');
    process.exit(4);
  }

  const title = overlay.querySelector('.overlay-title');
  const cta = overlay.querySelector('.overlay-cta');
  console.log('overlay exists:', !!overlay);
  console.log('title text:', title ? title.textContent.trim() : '<none>');
  console.log('cta text:', cta ? cta.textContent.trim() : '<none>');
  console.log('cta href:', cta ? cta.getAttribute('href') : '<none>');
  process.exit(0);
}, 200);

