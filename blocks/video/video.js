function loadVideoEmbed() {}

export default function decorate(block) {
  // Find a video link in the block
  const linkEl = block.querySelector('a, video, source');
  const link = linkEl && (linkEl.href || linkEl.src || linkEl.getAttribute('href') || linkEl.getAttribute('src'));
  // force autoplay, loop and hide controls for this block
  loadVideoEmbed(block, link, true, true);

  // Always create overlay container matching the design
  block.classList.add('has-overlay');
  block.classList.add('position-center');

  const overlay = document.createElement('div');
  overlay.className = 'video-overlay';
  const content = document.createElement('div');
  content.className = 'overlay-content';

  // Try to find dynamic elements inside the block
  const foundTitle = block.querySelector('h1, .overlay-title');
  const foundSubtitle = block.querySelector('p, .overlay-subtitle');
  const foundCta = block.querySelector('a, .overlay-cta, button');

  // Title
  const title = document.createElement('h1');
  title.className = 'overlay-title';
  title.textContent = foundTitle ? foundTitle.textContent.trim() : 'GYM-READY GIFTS';
  try {
    title.style.setProperty('font-size', '56pt', 'important');
  } catch (e) {
    title.style.fontSize = '56pt';
  }
  content.appendChild(title);

  // Subtitle
  const subtitle = document.createElement('p');
  subtitle.className = 'overlay-subtitle';
  subtitle.textContent = foundSubtitle ? foundSubtitle.textContent.trim() : 'Fuel their routine with the best workout styles.';
  content.appendChild(subtitle);

  // Button
  const cta = document.createElement('a');
  cta.className = 'overlay-cta';
  cta.href = foundCta && foundCta.getAttribute('href') ? foundCta.getAttribute('href') : '#';
  cta.textContent = foundCta ? foundCta.textContent.trim() : 'Shop Gifts';
  cta.style.marginTop = '16px';
  content.appendChild(cta);

  // Dots
  const dots = document.createElement('div');
  dots.className = 'overlay-dots';
  for (let i = 0; i < 3; i += 1) {
    const dot = document.createElement('span');
    dots.appendChild(dot);
  }
  content.appendChild(dots);

  overlay.appendChild(content);
  block.appendChild(overlay);
}
