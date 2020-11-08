const bigCircle = document.getElementById("bigCircle")
const bigArrow = document.getElementById("bigArrow")

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

var arrows = document.getElementsByClassName("arrow")

var arrowsArr = Array.from(arrows);

for (let i=0; i<arrowsArr.length; i++) {
  console.log(arrowsArr[i].parentElement.getBoundingClientRect());
  arrowsArr[i].setAttribute("transform", "rotate(34)");
  console.log(arrowsArr[i].getBoundingClientRect())
}

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




  //rotate each circle
  for (let i=0; i<arrowsArr.length; i++) {
    let scrollY = window.scrollY;

    circle = arrowsArr[i];
    circleParent = circle.parentElement;
    //calculate center coordinates of each circle based on the svg parent
    let circleCenterX = circleParent.getBoundingClientRect().left + circleParent.getBoundingClientRect().width/2;
    let circleCenterY = circleParent.getBoundingClientRect().top + circleParent.getBoundingClientRect().height/2;
    //rotate each circle based on it's center and current mouse position
    let rotateAmount = twisterMath(x, y,(circleCenterX) , (circleCenterY))-180;
    //move ball in direction of cursor while still anhoring it in the center



    let distanceFromCenterX = x-circleCenterX;
    let distanceFromCenterY = y-circleCenterY;
    circleParent.style.left = distanceFromCenterX/30 + 'px';

    //calculate distance cursor is from center of circle with pythagoras theorem
    var a = x-circleCenterX;
    var b = y-circleCenterY;

    var distance = Math.sqrt( a*a + b*b );

    let scaleAmount = distance/10000 - 1

    //check if cursor is hovered over circle
    let circleLeft = circleParent.getBoundingClientRect().left;
    let circleRight = circleParent.getBoundingClientRect().right;
    let circleTop = circleParent.getBoundingClientRect().top;
    let circleBottom = circleParent.getBoundingClientRect().bottom;

    if (x > circleLeft && x < circleRight && y > circleTop && y < circleBottom) {
      console.log("circle hovered!")
      circle.parentElement.parentElement.style.zIndex = "0"
      circle.parentElement.style.transform = "scale(1.1)"
    } else {
      circle.parentElement.parentElement.style.zIndex = "5"
      circle.parentElement.style.transform = "scale(1)"
    }

    circle.style.transform = `rotate(${rotateAmount}deg) scale(${scaleAmount})`



  };

};



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
