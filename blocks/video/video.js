function embedYoutube(url, autoplay, background) {
  const usp = new URLSearchParams(url.search);
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      mute: background ? '1' : '0',
      controls: background ? '0' : '1',
      disablekb: background ? '1' : '0',
      loop: background ? '1' : '0',
      playsinline: background ? '1' : '0',
    };
    suffix = `&${Object.entries(suffixParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  }
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }

  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function getVideoElement(source) {
  const video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('loop', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.removeAttribute('controls');
  video.addEventListener('canplay', () => {
    video.muted = true;
    video.play();
  });
  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', 'video/mp4');
  video.append(sourceEl);
  return video;
}

const loadVideoEmbed = (block, link) => {
  const isYoutube = link.includes('youtube') || link.includes('youtu.be');
  if (isYoutube) {
    const url = new URL(link);
    const embedWrapper = embedYoutube(url, true, true);
    block.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      block.dataset.embedLoaded = true;
    });
  } else {
    const videoEl = getVideoElement(link);
    block.append(videoEl);
    videoEl.addEventListener('canplay', () => {
      block.dataset.embedLoaded = true;
    });
  }
};

export default function decorate(block) {
  // Get the first, second, third, and fourth divs
  const divs = block.querySelectorAll(':scope > div');
  const videoDiv = divs[0];
  const overlayDiv = divs[1];
  const linkDiv = divs[2];
  const labelDiv = divs[3];
  // Get the video link from the first div
  const link = videoDiv?.querySelector('a')?.innerHTML.trim() || '';
  // Clear block and set up for embed
  block.textContent = '';
  block.dataset.embedLoaded = false;
  loadVideoEmbed(block, link);

  // Make block position relative for overlay stacking
  block.style.position = 'relative';

  // Render the 2nd div as overlay if it exists
  if (overlayDiv) {
    const overlay = document.createElement('div');
    overlay.className = 'video-text-overlay';
    while (overlayDiv.firstChild) {
      overlay.appendChild(overlayDiv.firstChild);
    }
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.pointerEvents = 'none';
    overlay.style.color = '#fff';
    overlay.style.textShadow = '0 2px 8px rgba(0,0,0,0.7)';
    overlay.style.zIndex = '2';
    block.appendChild(overlay);
  }

  // Render the 3rd div as subtext between overlay and link
  if (linkDiv) {
    const subtextOverlay = document.createElement('div');
    subtextOverlay.className = 'video-subtext-overlay';
    while (linkDiv.firstChild) {
      subtextOverlay.appendChild(linkDiv.firstChild);
    }
    subtextOverlay.style.position = 'absolute';
    subtextOverlay.style.left = '50%';
    subtextOverlay.style.top = '60%';
    subtextOverlay.style.transform = 'translateX(-50%)';
    subtextOverlay.style.zIndex = '3';
    subtextOverlay.style.pointerEvents = 'none';
    subtextOverlay.style.color = '#fff';
    subtextOverlay.style.textShadow = '0 2px 8px rgba(0,0,0,0.7)';
    subtextOverlay.style.fontSize = '1.25rem';
    block.appendChild(subtextOverlay);
  }

  // Render the 4th div as a link (a href) and set its text to the value from the 5th div
  if (divs[3] || divs[4]) {
    const linkDiv = divs[3];
    const valueDiv = divs[4];
    let href = '#';
    let linkText = '';
    // Get href from an <a> in the 4th div, or use its text
    const aTag = linkDiv ? linkDiv.querySelector('a') : null;
    if (aTag && aTag.getAttribute('href')) {
      href = aTag.getAttribute('href');
    } else if (linkDiv) {
      href = linkDiv.textContent.trim();
    }
    // Get value from 5th div
    if (valueDiv) {
      linkText = valueDiv.textContent.trim();
    }
    // Create overlay link
    const linkOverlay = document.createElement('a');
    linkOverlay.className = 'video-link-overlay';
    linkOverlay.href = href;
    linkOverlay.textContent = linkText || href;
    // Style overlay for positioning
    linkOverlay.style.position = 'absolute';
    linkOverlay.style.bottom = '32px';
    linkOverlay.style.left = '50%';
    linkOverlay.style.transform = 'translateX(-50%)';
    linkOverlay.style.zIndex = '4';
    linkOverlay.style.pointerEvents = 'auto';
    linkOverlay.style.color = '#fff';
    linkOverlay.style.background = 'rgba(0,0,0,0.5)';
    linkOverlay.style.padding = '0.5em 1em';
    linkOverlay.style.borderRadius = '24px';
    linkOverlay.style.textDecoration = 'none';
    linkOverlay.style.fontWeight = 'bold';
    block.appendChild(linkOverlay);
  }
}
