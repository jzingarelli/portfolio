const bigCircle = document.getElementById("bigCircle")
const bigArrow = document.getElementById("bigArrow")

//set global mouse coordinate variables
var xmouse;
var ymouse;

//refresh mouse coordinates anytime mouse is moved
window.addEventListener("mousemove", function(e) {
  xmouse = e.clientX
  ymouse = e.clientY
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
    circle.style.transform = `rotate(${rotateAmount}deg)`
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


// ========================================
// INTERACTIVE ENHANCEMENTS
// ========================================

// Custom Cursor Trail
const cursorTrail = [];
const trailLength = 20;

function createTrailDot() {
  const dot = document.createElement('div');
  dot.className = 'cursor-trail';
  document.body.appendChild(dot);
  return dot;
}

for (let i = 0; i < trailLength; i++) {
  cursorTrail.push(createTrailDot());
}

let mouseX = 0;
let mouseY = 0;
let trailIndex = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  const trail = cursorTrail[trailIndex];
  trail.style.left = mouseX + 'px';
  trail.style.top = mouseY + 'px';
  trail.style.opacity = '1';
  
  trailIndex = (trailIndex + 1) % trailLength;
});

// Confetti Effect
function createConfetti(x, y) {
  const colors = ['#FFD748', '#FF6B70', '#A0DDFF', '#B182FF', '#FFC01D'];
  const confettiCount = 30;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    const angle = (Math.PI * 2 * i) / confettiCount;
    const velocity = 2 + Math.random() * 4;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity;
    
    confetti.style.setProperty('--dx', dx);
    confetti.style.setProperty('--dy', dy);
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 1000);
  }
}

// Add confetti to profile picture
const avatar = document.querySelector('.avatar');
if (avatar) {
  avatar.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createConfetti(x, y);
    this.style.transform = 'scale(1.1) rotate(5deg)';
    setTimeout(() => {
      this.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
  });
}

// Magnetic Buttons
const buttons = document.querySelectorAll('#inquireButton');
buttons.forEach(button => {
  button.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
  });
  
  button.addEventListener('mouseleave', function() {
    this.style.transform = 'translate(0, 0) scale(1)';
  });
});

// Color wave effect on background based on scroll
function updateBackgroundColor() {
  const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  const colors = [
    { r: 245, g: 237, b: 226 }, // #F5EDE2
    { r: 255, g: 240, b: 245 }, // Pink tint
    { r: 240, g: 248, b: 255 }, // Blue tint
    { r: 255, g: 250, b: 240 }, // Yellow tint
    { r: 245, g: 237, b: 226 }  // Back to original
  ];
  
  const segment = scrollPercent * (colors.length - 1);
  const index = Math.floor(segment);
  const nextIndex = Math.min(index + 1, colors.length - 1);
  const t = segment - index;
  
  const color1 = colors[index];
  const color2 = colors[nextIndex];
  
  const r = Math.round(color1.r + (color2.r - color1.r) * t);
  const g = Math.round(color1.g + (color2.g - color1.g) * t);
  const b = Math.round(color1.b + (color2.b - color1.b) * t);
  
  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

window.addEventListener('scroll', debounce(updateBackgroundColor, 10));

// Bouncy arrow clicks
arrowsArr.forEach((arrow, index) => {
  arrow.parentElement.parentElement.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createConfetti(x, y);
    
    this.style.animation = 'bounce 0.5s ease';
    setTimeout(() => {
      this.style.animation = '';
    }, 500);
  });
});

// 3D Tilt effect on project sections
const projectSections = document.querySelectorAll('.newColorBlock');
projectSections.forEach(section => {
  section.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    
    const rotateX = deltaY * -2;
    const rotateY = deltaX * 2;
    
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
  });
  
  section.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

// Floating animation for hero images
const heroImages = document.querySelectorAll('.heroImg img');
heroImages.forEach((img, index) => {
  img.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
  img.style.animationDelay = `${index * 0.2}s`;
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    document.body.style.animation = 'rainbow 2s linear infinite';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 5000);
    
    // Confetti explosion
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createConfetti(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
      }, i * 200);
    }
  }
});

// Sparkle effect on hover for tags
const tags = document.querySelectorAll('#tags span');
tags.forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.animation = 'sparkle 0.6s ease';
  });
  tag.addEventListener('animationend', function() {
    this.style.animation = '';
  });
});

// Particle Canvas Animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.3 + 0.1;
    this.color = ['#FFD748', '#FF6B70', '#A0DDFF', '#B182FF'][Math.floor(Math.random() * 4)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around screen
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = [];
const particleCount = 50;

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  // Draw connections between nearby particles
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;

  requestAnimationFrame(animateParticles);
}

animateParticles();

// Fun text reveal effect on intro paragraph
const introParagraph = document.getElementById('introParagraph');
if (introParagraph) {
  const originalText = introParagraph.innerHTML;
  introParagraph.style.opacity = '0';
  
  setTimeout(() => {
    introParagraph.style.opacity = '1';
    introParagraph.style.transition = 'opacity 1s ease';
  }, 500);
}

// Add interactive click effect to project descriptions
const projectDescriptions = document.querySelectorAll('#projectDescription');
projectDescriptions.forEach(desc => {
  desc.addEventListener('click', function(e) {
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 215, 72, 0.4)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';
    
    const rect = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left - 10) + 'px';
    ripple.style.top = (e.clientY - rect.top - 10) + 'px';
    
    this.style.position = 'relative';
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Make the intro highlighted text wiggle on hover
const highlightedLinks = document.querySelectorAll('#introParagraph a');
highlightedLinks.forEach(link => {
  link.parentElement.style.transition = 'transform 0.2s ease';
  link.parentElement.addEventListener('mouseenter', function() {
    this.style.transform = 'rotate(-1deg) scale(1.05)';
  });
  link.parentElement.addEventListener('mouseleave', function() {
    this.style.transform = 'rotate(0deg) scale(1)';
  });
});

// Double click Easter egg on "Hello! I'm Joey"
const helloIntro = document.getElementById('helloIntro');
if (helloIntro) {
  helloIntro.addEventListener('dblclick', function() {
    const originalText = this.innerHTML;
    this.style.animation = 'rainbow 3s linear infinite';
    this.innerHTML = 'Hello!<br> Let\'s work<br>together! ✨';
    
    setTimeout(() => {
      this.style.animation = '';
      this.innerHTML = originalText;
    }, 3000);
  });
}

// Add smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add parallax effect to avatar on scroll
window.addEventListener('scroll', () => {
  if (avatar) {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.05;
    avatar.style.transform = `translateY(${rate}px)`;
  }
});

// Hide loading screen and animate entrance
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      document.body.classList.remove('loading');
    }, 500);
    
    // Shake animation on page load for arrows
    arrowsArr.forEach((arrow, index) => {
      setTimeout(() => {
        arrow.parentElement.parentElement.style.animation = 'bounce 0.6s ease';
        setTimeout(() => {
          arrow.parentElement.parentElement.style.animation = '';
        }, 600);
      }, index * 200);
    });
  }, 800);
});
