const bigCircle = document.getElementById("bigCircle")
const bigArrow = document.getElementById("bigArrow")

//set global mouse coordinate variables
var xmouse;
var ymouse;

// Add particle system
const particles = [];
const particleCount = 50;

//refresh mouse coordinates anytime mouse is moved
window.addEventListener("mousemove", function(e) {
  xmouse = e.clientX
  ymouse = e.clientY
});

// Add click effects
window.addEventListener("click", function(e) {
  createClickEffect(e.clientX, e.clientY);
  playClickSound();
});

// Sound effects
function playClickSound() {
  // Create a simple click sound using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playBounceSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
  
  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}

// Create click ripple effect
function createClickEffect(x, y) {
  const ripple = document.createElement('div');
  ripple.style.position = 'fixed';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.width = '0px';
  ripple.style.height = '0px';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(255, 192, 29, 0.3)';
  ripple.style.transform = 'translate(-50%, -50%)';
  ripple.style.pointerEvents = 'none';
  ripple.style.zIndex = '1000';
  ripple.style.transition = 'all 0.6s ease-out';
  
  document.body.appendChild(ripple);
  
  setTimeout(() => {
    ripple.style.width = '200px';
    ripple.style.height = '200px';
    ripple.style.opacity = '0';
  }, 10);
  
  setTimeout(() => {
    document.body.removeChild(ripple);
  }, 600);
}

// Initialize particles
function initParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2
    });
  }
}

// Create particle element
function createParticleElement(particle) {
  const element = document.createElement('div');
  element.style.position = 'fixed';
  element.style.left = particle.x + 'px';
  element.style.top = particle.y + 'px';
  element.style.width = particle.size + 'px';
  element.style.height = particle.size + 'px';
  element.style.background = '#FFC01D';
  element.style.borderRadius = '50%';
  element.style.opacity = particle.opacity;
  element.style.pointerEvents = 'none';
  element.style.zIndex = '-5';
  element.style.transition = 'all 0.1s ease-out';
  return element;
}

// Update particles
function updateParticles() {
  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // Bounce off edges
    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
    
    // Keep particles in bounds
    particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
    particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
  });
}

// Render particles
function renderParticles() {
  // Remove existing particle elements
  document.querySelectorAll('.particle').forEach(el => el.remove());
  
  // Create new particle elements
  particles.forEach(particle => {
    const element = createParticleElement(particle);
    element.classList.add('particle');
    document.body.appendChild(element);
  });
}

// Initialize particles on load
initParticles();

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
  
  // Update particles
  updateParticles();
  renderParticles();
  
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
    
    // Add scale effect based on mouse distance
    let distance = Math.sqrt(Math.pow(x - circleCenterX, 2) + Math.pow(y - circleCenterY, 2));
    let scale = Math.max(0.8, 1 - (distance / 1000));
    
    circle.style.transform = `rotate(${rotateAmount}deg) scale(${scale})`;
    
    // Add hover effect
    if (distance < 100) {
      circle.style.filter = 'drop-shadow(0 0 10px rgba(255, 192, 29, 0.5))';
      circleParent.style.transform = 'scale(1.1)';
    } else {
      circle.style.filter = 'none';
      circleParent.style.transform = 'scale(1)';
    }
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

// Add interactive hover effects for project cards
document.addEventListener('DOMContentLoaded', function() {
  // Add hover effects to project cards
  const projectCards = document.querySelectorAll('.container');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
      this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
  });

  // Add interactive effects to contact links
  const contactLinks = document.querySelectorAll('.contactLinks');
  contactLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.1)';
      this.style.transition = 'all 0.3s ease';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add typing effect to the hello intro
  const helloIntro = document.getElementById('helloIntro');
  if (helloIntro) {
    const text = helloIntro.innerHTML;
    helloIntro.innerHTML = '';
    helloIntro.style.opacity = '1';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        helloIntro.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };
    
    setTimeout(typeWriter, 500);
  }

  // Add floating animation to arrows
  const arrows = document.querySelectorAll('.arrow');
  arrows.forEach((arrow, index) => {
    arrow.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
  });

  // Add parallax effect to background elements
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.heroImagesBackground');
    
    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.1);
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Add interactive cursor trail
  let cursorTrail = [];
  const maxTrailLength = 20;

  document.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    if (cursorTrail.length > maxTrailLength) {
      cursorTrail.shift();
    }
    
    // Remove old trail elements
    document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
    
    // Create new trail elements
    cursorTrail.forEach((point, index) => {
      if (Date.now() - point.time < 200) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.position = 'fixed';
        trail.style.left = point.x + 'px';
        trail.style.top = point.y + 'px';
        trail.style.width = '4px';
        trail.style.height = '4px';
        trail.style.background = '#FFC01D';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '1000';
        trail.style.opacity = (index / maxTrailLength) * 0.5;
        trail.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(trail);
      }
    });
  });

  // Interactive bouncing ball
  const bouncingBall = document.getElementById('bouncingBall');
  const funZone = document.getElementById('funZone');
  const easterEgg = document.getElementById('easterEgg');
  const helpPanel = document.getElementById('helpPanel');
  const helpToggle = document.getElementById('helpToggle');
  const closeHelp = document.getElementById('closeHelp');
  
  let ballVelocity = { x: 0, y: 0 };
  let ballPosition = { x: 0, y: 0 };
  let isBouncing = false;
  let bounceCount = 0;
  
  if (bouncingBall) {
    bouncingBall.addEventListener('click', function() {
      if (!isBouncing) {
        isBouncing = true;
        ballVelocity = { x: (Math.random() - 0.5) * 10, y: -8 };
        bounceCount++;
        
        // Add some visual feedback
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
        
        // Start bouncing animation
        animateBall();
      }
    });
  }
  
  function animateBall() {
    if (!isBouncing) return;
    
    ballPosition.x += ballVelocity.x;
    ballPosition.y += ballVelocity.y;
    ballVelocity.y += 0.5; // gravity
    
    // Bounce off walls
    if (ballPosition.x < 0 || ballPosition.x > window.innerWidth - 50) {
      ballVelocity.x *= -0.8;
      ballPosition.x = Math.max(0, Math.min(window.innerWidth - 50, ballPosition.x));
    }
    
    if (ballPosition.y > window.innerHeight - 50) {
      ballVelocity.y *= -0.8;
      ballPosition.y = window.innerHeight - 50;
      playBounceSound(); // Add bounce sound
      
      // Stop bouncing after a few bounces
      if (Math.abs(ballVelocity.y) < 1) {
        isBouncing = false;
        ballPosition = { x: 0, y: 0 };
        ballVelocity = { x: 0, y: 0 };
        bouncingBall.style.transform = 'translate(0, 0)';
        return;
      }
    }
    
    bouncingBall.style.transform = `translate(${ballPosition.x}px, ${ballPosition.y}px)`;
    requestAnimationFrame(animateBall);
  }
  
  // Easter egg functionality
  if (easterEgg) {
    easterEgg.addEventListener('click', function() {
      // Toggle fun zone visibility
      if (funZone.style.opacity === '0') {
        funZone.style.opacity = '1';
        this.textContent = '🎉 Fun Mode ON';
        this.style.background = 'linear-gradient(45deg, #FF6B70, #A0DDFF)';
        
        // Add confetti effect
        createConfetti();
      } else {
        funZone.style.opacity = '0';
        this.textContent = '🎉 Fun Mode';
        this.style.background = 'linear-gradient(45deg, #FFC01D, #FF6B70)';
      }
    });
  }

  // Help panel functionality
  if (helpToggle && helpPanel && closeHelp) {
    helpToggle.addEventListener('click', function() {
      helpPanel.style.opacity = '1';
      helpPanel.style.transform = 'translateX(0)';
      this.style.display = 'none';
    });

    closeHelp.addEventListener('click', function() {
      helpPanel.style.opacity = '0';
      helpPanel.style.transform = 'translateX(-100%)';
      helpToggle.style.display = 'flex';
    });
  }
  
  // Confetti effect
  function createConfetti() {
    const colors = ['#FFC01D', '#FF6B70', '#A0DDFF', '#B182FF'];
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.animation = 'confettiFall 3s linear forwards';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
          confetti.remove();
        }, 3000);
      }, i * 50);
    }
  }
  
  // Add confetti animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes confettiFall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
    
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    
    .rainbow-mode {
      animation: rainbow 2s linear infinite;
    }
  `;
  document.head.appendChild(style);
  
  // Keyboard interactions
  let rainbowMode = false;
  document.addEventListener('keydown', function(e) {
    // Press 'R' for rainbow mode
    if (e.key.toLowerCase() === 'r') {
      rainbowMode = !rainbowMode;
      const body = document.body;
      if (rainbowMode) {
        body.classList.add('rainbow-mode');
        createConfetti();
      } else {
        body.classList.remove('rainbow-mode');
      }
    }
    
    // Press 'P' to toggle particles
    if (e.key.toLowerCase() === 'p') {
      const particles = document.querySelectorAll('.particle');
      particles.forEach(particle => {
        particle.style.display = particle.style.display === 'none' ? 'block' : 'none';
      });
    }
    
    // Press 'S' for surprise
    if (e.key.toLowerCase() === 's') {
      createSurprise();
    }
  });
  
  // Surprise function
  function createSurprise() {
    // Create floating emojis
    const emojis = ['🎉', '✨', '🌟', '💫', '🎊', '🎈', '🎁', '🌈'];
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.position = 'fixed';
        emoji.style.left = Math.random() * window.innerWidth + 'px';
        emoji.style.top = Math.random() * window.innerHeight + 'px';
        emoji.style.fontSize = '30px';
        emoji.style.pointerEvents = 'none';
        emoji.style.zIndex = '1000';
        emoji.style.animation = 'confettiFall 3s linear forwards';
        
        document.body.appendChild(emoji);
        
        setTimeout(() => {
          emoji.remove();
        }, 3000);
      }, i * 100);
    }
  }
  
  // Add mouse trail enhancement
  let mouseTrailEnabled = true;
  document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 't') {
      mouseTrailEnabled = !mouseTrailEnabled;
    }
  });
  
  // Enhanced mouse trail
  document.addEventListener('mousemove', function(e) {
    if (!mouseTrailEnabled) return;
    
    // Create sparkle effect
    if (Math.random() < 0.1) {
      const sparkle = document.createElement('div');
      sparkle.innerHTML = '✨';
      sparkle.style.position = 'fixed';
      sparkle.style.left = e.clientX + 'px';
      sparkle.style.top = e.clientY + 'px';
      sparkle.style.fontSize = '20px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '1000';
      sparkle.style.animation = 'confettiFall 1s linear forwards';
      
      document.body.appendChild(sparkle);
      
      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    }
  });
});
