const bigCircle = document.getElementById("bigCircle")
const bigArrow = document.getElementById("bigArrow")

//set global mouse coordinate variables
var xmouse;
var ymouse;

// Create custom cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

// Create scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.classList.add('scroll-progress');
document.body.appendChild(scrollProgress);

//refresh mouse coordinates anytime mouse is moved
window.addEventListener("mousemove", function(e) {
  xmouse = e.clientX
  ymouse = e.clientY
  
  // Update custom cursor position
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Handle cursor hover states
document.addEventListener('mouseover', function(e) {
  if (e.target.matches('a, button, .arrow, .contactLinks, #inquireButton')) {
    cursor.classList.add('hover');
  }
});

document.addEventListener('mouseout', function(e) {
  if (e.target.matches('a, button, .arrow, .contactLinks, #inquireButton')) {
    cursor.classList.remove('hover');
  }
});

var x = 0;
var y = 0;
var dx = 0;
var dy = 0;

var arrows = document.getElementsByClassName("arrow")

var arrowsArr = Array.from(arrows);

heroImageBackgrounds = document.getElementsByClassName("heroImagesBackground");

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

  //rotate each circle + move front and back bits
  for (let i=0; i<arrowsArr.length; i++) {
    let scrollY = window.scrollY;

    circle = arrowsArr[i];
    circleParent = circle.parentElement;
    //calculate center coordinates of each circle based on the svg parent
    let circleCenterX = circleParent.getBoundingClientRect().left + circleParent.getBoundingClientRect().width/2;
    let circleCenterY = circleParent.getBoundingClientRect().top + circleParent.getBoundingClientRect().height/2;
    //rotate each circle based on it's center and current mouse position
    let rotateAmount = twisterMath(x, y,(circleCenterX) , (circleCenterY));
    
    // Add subtle floating animation based on scroll and mouse position
    let floatOffset = Math.sin(Date.now() * 0.001 + i) * 2;
    circle.style.transform = `rotate(${rotateAmount}deg) translateY(${floatOffset}px)`;
  };

  //get mouse distance from center of screen
  let disctanceFromScreenCenterX = (x-window.innerWidth/2)/600;
  let disctanceFromScreenCenterY = (y - window.innerHeight/2)/70;

  //move back bits
  var bitsBack = document.getElementById("bitsBack")
  var bitsFront = document.getElementById("bitsFront")
  bitsBack.style.left = `${disctanceFromScreenCenterX + 50}%`;
  bitsBack.style.top = `${disctanceFromScreenCenterY + 125 - scrollY/10}px`;
  //move front bits
  bitsFront.style.left = `${50 - disctanceFromScreenCenterX}%`;
  bitsFront.style.top = `${150 - disctanceFromScreenCenterY - scrollY/15}px`;

  // move portfolio piece graphic backgrounds and her images
  for (let i=0; i < heroImageBackgrounds.length; i++) {
    heroImageBackgrounds[i].style.left = `${50 - disctanceFromScreenCenterX/2}%`
    heroImageBackgrounds[i].style.top = `${50 - disctanceFromScreenCenterY/2}%`

  }


};

followMouse();


function twisterMath(x, y, xShapeCenter, yShapeCenter){
  return  Math.atan2(x - xShapeCenter,-(y - yShapeCenter)) *(180 / Math.PI) - 90
}



// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};


//fade in hero images
const fadeInElements = document.querySelectorAll('.fadeIn')

function checkFadeIn(e) {

  fadeInElements.forEach(fadeInElement => {
    //half image height
    const fadeInElementViewPortOffset = fadeInElement.getBoundingClientRect();
    const fadeInAt = (window.scrollY + window.innerHeight) - (fadeInElement.offsetHeight/2);
    const isHalfShown = fadeInAt > fadeInElementViewPortOffset.top + scrollY;

    if (isHalfShown) {
      //animate in the element
      fadeInElement.classList.add('active')
      //get all the children of the element
      const fadeInElementChildren = fadeInElement.children;
      for (let i=0; i<fadeInElementChildren.length; i++) {
        //for each element child set opacity and transform

        fadeInElementChildren[i].style.transition=`opacity 250ms ease-in, transform 500ms`;
        fadeInElementChildren[i].style.transitionDelay=`${i*100}ms`;
        fadeInElementChildren[i].style.opacity='1';
        fadeInElementChildren[i].style.transform=`translate3d(0px, 0px, 0px)`;

      }
    }
  });

}

window.addEventListener('scroll', debounce(checkFadeIn, 50));
window.addEventListener('scroll', updateScrollProgress);

// Add intersection observer for more efficient scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      // Create particles when sections come into view
      if (Math.random() > 0.9) {
        createParticle();
      }
    }
  });
}, observerOptions);

// Observe all project sections
document.querySelectorAll('.container').forEach(container => {
  observer.observe(container);
});

// Update scroll progress indicator with color transitions
function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';
  
  // Change color based on scroll position
  if (scrollPercent < 25) {
    scrollProgress.style.background = '#FFD748';
  } else if (scrollPercent < 50) {
    scrollProgress.style.background = '#FF6B70';
  } else if (scrollPercent < 75) {
    scrollProgress.style.background = '#A0DDFF';
  } else {
    scrollProgress.style.background = '#B182FF';
  }
}

// Create floating particles with enhanced variety
function createParticle() {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  
  const colors = ['#FFD748', '#FF6B70', '#A0DDFF', '#B182FF', '#FFC01D', '#63C7FF'];
  const shapes = ['circle', 'square', 'triangle'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  
  particle.style.background = color;
  const size = Math.random() * 6 + 3;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.left = Math.random() * (window.innerWidth + 60) - 30 + 'px';
  particle.style.top = window.innerHeight + Math.random() * 30 + 15 + 'px';
  particle.style.opacity = Math.random() * 0.5 + 0.3;
  
  // Apply different shapes with enhanced styling
  if (shape === 'square') {
    particle.style.borderRadius = '2px';
    particle.style.transform += ' rotate(45deg)';
  } else if (shape === 'triangle') {
    particle.style.borderRadius = '0';
    particle.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
  } else {
    // Add some variety to circles
    if (Math.random() > 0.7) {
      particle.style.border = '1px solid rgba(255,255,255,0.3)';
      particle.style.background = 'transparent';
    }
  }
  
  // Add random animation duration and delay
  particle.style.animationDuration = (Math.random() * 2.5 + 4.5) + 's';
  particle.style.animationDelay = Math.random() * 1.2 + 's';
  
  // Add subtle rotation and initial scale
  particle.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.9 + Math.random() * 0.2})`;
  
  document.body.appendChild(particle);
  
  // Animate particle upward with enhanced drift and effects
  let posY = window.innerHeight + 20;
  let posX = parseInt(particle.style.left);
  const speed = Math.random() * 1.0 + 0.5;
  const drift = (Math.random() - 0.5) * 0.2;
  let rotation = Math.random() * 360;
  const rotationSpeed = (Math.random() - 0.5) * 1.5;
  let opacity = parseFloat(particle.style.opacity);
  let scale = 1;
  
  function animateUp() {
    posY -= speed;
    posX += drift + Math.sin(posY * 0.006) * 0.1; // Add subtle wave motion
    rotation += rotationSpeed;
    
    // Fade out as it reaches the top
    if (posY < window.innerHeight * 0.5) {
      opacity *= 0.997;
      scale *= 0.9995;
    }
    
    particle.style.top = posY + 'px';
    particle.style.left = posX + 'px';
    particle.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    particle.style.opacity = opacity;
    
    if (posY > -20 && opacity > 0.03) {
      requestAnimationFrame(animateUp);
    } else {
      particle.remove();
    }
  }
  
  animateUp();
}

// Create particles periodically with variable timing
let particleInterval = setInterval(() => {
  if (Math.random() > 0.5) { // 50% chance to create particle
    createParticle();
  }
  // Vary the interval between 3 and 5 seconds
  clearInterval(particleInterval);
  particleInterval = setInterval(() => {
    if (Math.random() > 0.6) {
      createParticle();
    }
  }, Math.random() * 2000 + 3000);
}, 4000);

// Add click effects to arrows
const arrows = document.querySelectorAll('.arrow');
arrows.forEach(arrow => {
  arrow.addEventListener('click', function(e) {
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 600ms linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.marginLeft = '-50px';
    ripple.style.marginTop = '-50px';
    ripple.style.pointerEvents = 'none';
    
    this.style.position = 'relative';
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    // Add bounce animation
    this.style.animation = 'bounce 500ms ease';
    setTimeout(() => {
      this.style.animation = '';
    }, 500);
  });
});

// Add enhanced interactive features
window.addEventListener('load', function() {
  const introElement = document.getElementById('helloIntro');
  if (introElement) {
    const originalText = introElement.textContent;
    setTimeout(() => {
      typeWriter(introElement, originalText, 90);
    }, 1000);
  }
  
  // Add initial particles with staggered timing
  for (let i = 0; i < 2; i++) {
    setTimeout(createParticle, i * 1000 + Math.random() * 400);
  }
  
  // Add welcome animation
  setTimeout(() => {
    document.body.style.opacity = '1';
    document.body.style.transform = 'scale(1)';
  }, 200);
  
  // Initialize scroll progress
  updateScrollProgress();
  
  // Add loading complete class
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 400);
});

// Add typing effect to intro text with cursor
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor">|</span>';
      i++;
      setTimeout(type, speed);
    } else {
      // Remove cursor after typing is complete
      setTimeout(() => {
        element.innerHTML = text;
      }, 800);
    }
  }
  type();
}

// Add magnetic effect to buttons with enhanced smoothness
const magneticElements = document.querySelectorAll('#inquireButton, .contactLinks, .arrow');

magneticElements.forEach(element => {
  element.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 50;
    
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance;
      const moveX = x * strength * 0.15;
      const moveY = y * strength * 0.15;
      const scale = 1 + strength * 0.06;
      this.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
      this.style.filter = `brightness(${1 + strength * 0.08})`;
    }
  });
  
  element.addEventListener('mouseleave', function() {
    this.style.transform = 'translate(0px, 0px) scale(1)';
    this.style.filter = 'brightness(1)';
  });
});

// Add CSS for enhanced animations
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0,0,0) scale(1);
    }
    40%, 43% {
      transform: translate3d(0,-15px,0) scale(1.1);
    }
    70% {
      transform: translate3d(0,-7px,0) scale(1.05);
    }
    90% {
      transform: translate3d(0,-2px,0) scale(1.02);
    }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .typing-cursor {
    animation: blink 1s infinite;
    color: #FFD748;
    font-weight: normal;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;
document.head.appendChild(style);

// Add parallax effect to background images
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.heroImagesBackground');
  
  parallaxElements.forEach((element, index) => {
    const speed = 0.2 + (index * 0.03);
    const scale = 1 + (scrolled * 0.00003);
    const rotation = scrolled * 0.005;
    element.style.transform = `translate(-50%, -50%) translateY(${scrolled * speed}px) scale(${scale}) rotate(${rotation}deg)`;
  });
  
  // Add subtle effects to title based on scroll
  const title = document.getElementById('helloIntro');
  if (title) {
    const floatY = Math.sin(scrolled * 0.008) * 2;
    const skew = Math.sin(scrolled * 0.003) * 0.3;
    title.style.transform = `translateX(-50%) translateY(${floatY}px) skew(${skew}deg)`;
  }
});

// Add smooth scroll to anchor links with particle trail
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      // Create particle trail during scroll
      const scrollInterval = setInterval(() => {
        if (Math.random() > 0.7) createParticle();
      }, 250);
      
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      setTimeout(() => {
        clearInterval(scrollInterval);
      }, 500);
    }
  });
});

// Add easter egg - konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
  konamiCode.push(e.code);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    // Easter egg activated!
    for (let i = 0; i < 20; i++) {
      setTimeout(createParticle, i * 100);
    }
    document.body.style.animation = 'rainbow 3s ease infinite';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 6000);
    
    // Show easter egg message
    const message = document.createElement('div');
    message.textContent = '🎉 KONAMI CODE ACTIVATED! 🎉';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.fontSize = '2rem';
    message.style.fontWeight = 'bold';
    message.style.color = '#FFD748';
    message.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
    message.style.zIndex = '10000';
    message.style.pointerEvents = 'none';
    message.style.animation = 'pulse 1s ease infinite';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 3000);
  }
});

// Add rainbow animation for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg) saturate(1); }
    25% { filter: hue-rotate(90deg) saturate(1.2); }
    50% { filter: hue-rotate(180deg) saturate(1.5); }
    75% { filter: hue-rotate(270deg) saturate(1.2); }
    100% { filter: hue-rotate(360deg) saturate(1); }
  }
`;
document.head.appendChild(rainbowStyle);
