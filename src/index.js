// Initialize mouse coordinates to center to avoid NaN on first frame
let xmouse = window.innerWidth / 2;
let ymouse = window.innerHeight / 2;

// Refresh mouse coordinates on move
window.addEventListener('mousemove', function handleMouseMove(event) {
  xmouse = event.clientX;
  ymouse = event.clientY;
}, { passive: true });

let x = xmouse;
let y = ymouse;
let dx = 0;
let dy = 0;

const arrows = document.getElementsByClassName('arrow');
const arrowsArr = Array.from(arrows);
const heroImageBackgrounds = document.getElementsByClassName('heroImagesBackground');

function followMouse() {
  // Continue the animation loop
  window.requestAnimationFrame(followMouse);

  // If page not visible, skip work this frame
  if (document.visibilityState !== 'visible') {
    return;
  }

  // Compute eased mouse-following position
  dx = (xmouse - x) * 0.09;
  dy = (ymouse - y) * 0.09;
  if (Math.abs(dx) + Math.abs(dy) < 0.1) {
    x = xmouse;
    y = ymouse;
  } else {
    x += dx;
    y += dy;
  }

  // Rotate circles
  for (let i = 0; i < arrowsArr.length; i++) {
    const circle = arrowsArr[i];
    const circleParent = circle.parentElement;
    const rect = circleParent.getBoundingClientRect();
    const circleCenterX = rect.left + rect.width / 2;
    const circleCenterY = rect.top + rect.height / 2;
    const rotateAmount = twisterMath(x, y, circleCenterX, circleCenterY);
    circle.style.transform = `rotate(${rotateAmount}deg)`;
  }

  // Compute offsets relative to screen center
  const distanceFromScreenCenterX = (x - window.innerWidth / 2) / 600;
  const distanceFromScreenCenterY = (y - window.innerHeight / 2) / 70;
  const currentScrollY = window.scrollY;

  // Move background and foreground bits
  const bitsBack = document.getElementById('bitsBack');
  const bitsFront = document.getElementById('bitsFront');
  if (bitsBack) {
    bitsBack.style.left = `${distanceFromScreenCenterX + 50}%`;
    bitsBack.style.top = `${distanceFromScreenCenterY + 125 - currentScrollY / 10}px`;
  }
  if (bitsFront) {
    bitsFront.style.left = `${50 - distanceFromScreenCenterX}%`;
    bitsFront.style.top = `${150 - distanceFromScreenCenterY - currentScrollY / 15}px`;
  }

  // Move portfolio piece graphic backgrounds
  for (let i = 0; i < heroImageBackgrounds.length; i++) {
    heroImageBackgrounds[i].style.left = `${50 - distanceFromScreenCenterX / 2}%`;
    heroImageBackgrounds[i].style.top = `${50 - distanceFromScreenCenterY / 2}%`;
  }
}

followMouse();

function twisterMath(xPosition, yPosition, xShapeCenter, yShapeCenter) {
  return Math.atan2(xPosition - xShapeCenter, -(yPosition - yShapeCenter)) * (180 / Math.PI) - 90;
}

// Simple debounce helper
function debounce(func, wait, immediate) {
  let timeout;
  return function debounced() {
    const context = this; // eslint-disable-line @typescript-eslint/no-this-alias
    const args = arguments;
    const later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Fade-in on scroll
const fadeInElements = document.querySelectorAll('.fadeIn');

function checkFadeIn() {
  const viewportBottom = window.scrollY + window.innerHeight;
  fadeInElements.forEach((fadeInElement) => {
    const elementRect = fadeInElement.getBoundingClientRect();
    const fadeInAt = viewportBottom - fadeInElement.offsetHeight / 2;
    const isHalfShown = fadeInAt > elementRect.top + window.scrollY;
    if (isHalfShown) {
      fadeInElement.classList.add('active');
      const fadeInElementChildren = fadeInElement.children;
      for (let i = 0; i < fadeInElementChildren.length; i++) {
        fadeInElementChildren[i].style.transition = 'opacity 250ms ease-in, transform 500ms';
        fadeInElementChildren[i].style.transitionDelay = `${i * 100}ms`;
        fadeInElementChildren[i].style.opacity = '1';
        fadeInElementChildren[i].style.transform = 'translate3d(0px, 0px, 0px)';
      }
    }
  });
}

window.addEventListener('scroll', debounce(checkFadeIn, 50), { passive: true });
window.addEventListener('load', checkFadeIn, { once: true });
