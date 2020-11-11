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
