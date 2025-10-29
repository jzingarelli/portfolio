// Cache DOM elements at initialization
const bigCircle = document.getElementById("bigCircle");
const bigArrow = document.getElementById("bigArrow");

// Set global mouse coordinate variables
let xmouse = 0;
let ymouse = 0;

// Refresh mouse coordinates with passive event listener for better performance
window.addEventListener("mousemove", function(e) {
  xmouse = e.clientX;
  ymouse = e.clientY;
}, { passive: true });

let x = 0;
let y = 0;
let dx = 0;
let dy = 0;

// Cache DOM queries
const arrows = document.getElementsByClassName("arrow");
const arrowsArr = Array.from(arrows);
const heroImageBackgrounds = document.getElementsByClassName("heroImagesBackground");
const bitsBack = document.getElementById("bitsBack");
const bitsFront = document.getElementById("bitsFront");

function followMouse() {
  //runs this function/animation infinetly
  window.requestAnimationFrame(followMouse);
  //only returns true on page load before cursor has been moved
  if(!x || !y) {
    x = xmouse;
    y = ymouse;
  } else {
    //sets delta between last and current cursor coordinates
    //the closer the number multiplied is to zero the farther behind it trails
    dx = (xmouse - x) * 0.09;
    dy = (ymouse - y) * 0.09;
    //if delta between last cursor and current cursor is small, set variables to current mouse position
    if(Math.abs(dx) + Math.abs(dy) < 0.1) {
      x = xmouse;
      y = ymouse;
    } else {
      //take delta and place cirle at that position relative to current cursor
      x += dx;
      y += dy;
    }
  }

  const scrollY = window.scrollY;
  
  // Rotate each circle + move front and back bits
  for (let i = 0; i < arrowsArr.length; i++) {
    const circle = arrowsArr[i];
    const circleParent = circle.parentElement;
    const rect = circleParent.getBoundingClientRect();
    
    // Calculate center coordinates of each circle based on the svg parent
    const circleCenterX = rect.left + rect.width / 2;
    const circleCenterY = rect.top + rect.height / 2;
    
    // Rotate each circle based on it's center and current mouse position
    const rotateAmount = twisterMath(x, y, circleCenterX, circleCenterY);
    circle.style.transform = `rotate(${rotateAmount}deg)`;
  }

  // Get mouse distance from center of screen
  const distanceFromScreenCenterX = (x - window.innerWidth / 2) / 600;
  const distanceFromScreenCenterY = (y - window.innerHeight / 2) / 70;

  // Move back bits
  if (bitsBack) {
    bitsBack.style.left = `${distanceFromScreenCenterX + 50}%`;
    bitsBack.style.top = `${distanceFromScreenCenterY + 125 - scrollY / 10}px`;
  }
  
  // Move front bits
  if (bitsFront) {
    bitsFront.style.left = `${50 - distanceFromScreenCenterX}%`;
    bitsFront.style.top = `${150 - distanceFromScreenCenterY - scrollY / 15}px`;
  }

  // Move portfolio piece graphic backgrounds
  for (let i = 0; i < heroImageBackgrounds.length; i++) {
    heroImageBackgrounds[i].style.left = `${50 - distanceFromScreenCenterX / 2}%`;
    heroImageBackgrounds[i].style.top = `${50 - distanceFromScreenCenterY / 2}%`;
  }


};

followMouse();


function twisterMath(x, y, xShapeCenter, yShapeCenter) {
  return Math.atan2(x - xShapeCenter, -(y - yShapeCenter)) * (180 / Math.PI) - 90;
}

// Use Intersection Observer for better performance than scroll events
const fadeInElements = document.querySelectorAll('.fadeIn');

// Create Intersection Observer for fade-in animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15 // Trigger when 15% of element is visible
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fadeInElement = entry.target;
      
      // Animate in the element
      fadeInElement.classList.add('active');
      
      // Get all the children of the element
      const fadeInElementChildren = fadeInElement.children;
      for (let i = 0; i < fadeInElementChildren.length; i++) {
        // For each element child set opacity and transform
        fadeInElementChildren[i].style.transition = `opacity 250ms ease-in, transform 500ms`;
        fadeInElementChildren[i].style.transitionDelay = `${i * 100}ms`;
        fadeInElementChildren[i].style.opacity = '1';
        fadeInElementChildren[i].style.transform = `translate3d(0px, 0px, 0px)`;
      }
      
      // Stop observing after animation triggers
      fadeInObserver.unobserve(fadeInElement);
    }
  });
}, observerOptions);

// Observe all fade-in elements
fadeInElements.forEach(element => {
  fadeInObserver.observe(element);
});
