const bigCircle = document.getElementById("bigCircle")
const bigArrow = document.getElementById("bigArrow")

//set elements to use in next function
let currentWindowState = null;
let currentWindowHeight = null;
let currentWindowWidth = null;

//change height of circle to equal width no matter screen size
function changeCircleHeight() {
  bigCircle.style.height = bigCircle.offsetWidth + 'px';
}
//make big circle's height equal it's width at runtime
changeCircleHeight()
//change circle height whenever window is resized
window.addEventListener("resize", changeCircleHeight)

//check current window sized
function currentWindowSize() {
  currentWindowHeight = window.innerHeight;
  currentWindowWidth = window.innerWidth;
}

//calculate center values for circle
var circleBaseTop = (window.innerHeight/2) - (bigCircle.offsetHeight/2);
var circleBaseLeft = (window.innerWidth/2) - (bigCircle.offsetWidth/2);

//function to center the circle
function centerCircle() {
  currentWindowSize()
  circleBaseTop = (window.innerHeight/2) - (bigCircle.offsetHeight/2);
  circleBaseLeft = (window.innerWidth/2) - (bigCircle.offsetWidth/2);

  //set the left and top to new values centering the circle
  bigCircle.style.left = circleBaseLeft + 'px'
  bigCircle.style.top = circleBaseTop +'px';

}
//center the circle on page load
centerCircle()
//center the circle when the screen is resized
window.addEventListener("resize", centerCircle)


//set global mouse coordinate variables
var xmouse;
var ymouse;

//refresh mouse coordinates anytime mouse is moved
window.addEventListener("mousemove", function(e) {
  xmouse = e.clientX || e.pageX;
  ymouse = e.clientY || e.pageY;
});

var x = 0;
var y = 0;
var dx = 0;
var dy = 0;

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

  var distanceFromCenterY = y-window.innerHeight/2;
  var distanceFromCenterX = x-window.innerWidth/2;

  //move ball in direction of cursor while still anhoring it in the center
  bigCircle.style.left = circleBaseLeft + distanceFromCenterX/30 + 'px';
  bigCircle.style.top = circleBaseTop + distanceFromCenterY/30 + 'px';



  let scrollY = window.scrollY;
  bigArrow.style.transform = 'rotate('+ twisterMath(x, y,(window.innerWidth/2 ) , (window.innerHeight/2 -scrollY))+'deg)';
};



function twisterMath(x, y, xShapeCenter, yShapeCenter){
  return  Math.atan2(x - xShapeCenter,-(y - yShapeCenter)) *(180 / Math.PI) - 90
}

var circleColors = ['#C5E3F4', '#BCE7DC', '#F38C8F']

const introParent = document.getElementById('intro');


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


//change header background color to match color block it's hovering
const colorBlocks = document.querySelectorAll(".newColorBlock")
const header = document.getElementById('header')

function changeHeaderColor(e) {
  colorBlocks.forEach(colorBlock => {
    //get positions of colorBlock
    let blockPosition = colorBlock.getBoundingClientRect()
    if (blockPosition.y-70 < 0 && blockPosition.y > -blockPosition.height && header.style.backgroundColor != colorBlock.style.backgroundColor) {
      header.style.backgroundColor = colorBlock.style.backgroundColor
    }
  });

}

window.addEventListener('scroll', debounce(changeHeaderColor));
