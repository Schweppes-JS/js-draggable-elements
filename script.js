const textNodes = document.querySelectorAll('[data-text]');
const closeButtonNodes = document.querySelectorAll('[data-close]');

let isSelected = false;
let isMoving = false;

function textMoving(e) {
  if (e.buttons != 1) return;
  if (!this.classList.contains("draggable")) return;
  // determining parent block width and height
  const parentWidth = parseInt(getComputedStyle(this.parentNode).getPropertyValue('width'));
  const parentHeight = parseInt(getComputedStyle(this.parentNode).getPropertyValue('height'));
  // determining this element block width and height
  const thisWidth = parseInt(getComputedStyle(this).getPropertyValue('width'));
  const thisHeight = parseInt(getComputedStyle(this).getPropertyValue('height'));
  // remember coordinate when element was pushed
  const coordinateXWhenPush = e.pageX;
  const coordinateYWhenPush = e.pageY;
  // remember element position in relation to the parent block
  const elementLeftPosition = parseInt(getComputedStyle(this).getPropertyValue('left'));
  const elementTopPosition = parseInt(getComputedStyle(this).getPropertyValue('top'));
  // adding grabbing cursor 
  this.classList.add('grabbing');
  let shiftX;
  let shiftY;
  isMoving = true;

  // start mouse event when mouse button is pushed
  document.onmousemove = (e) => {
    // calculate difference between start and current coordinate
    shiftX = e.pageX - coordinateXWhenPush;
    shiftY = e.pageY - coordinateYWhenPush;
    // if the movement was less than 3 pixels take it as a click without drag
    if (Math.abs(shiftX) < 3 && Math.abs(shiftY) < 3) return;
    isSelected = true;
    if (isMoving) {
      // setting element 'left' position in relation to the parent block
      // if in the middle of parent block
      if ((elementLeftPosition + shiftX) >= 0) {
        this.style.left = `${elementLeftPosition + shiftX}px`;
        this.classList.remove('reverse');
      }
      // if on the left side of parent block
      else this.style.left = "0px";
      // if on the left side of parent block
      if ((elementLeftPosition + shiftX + thisWidth) >= parentWidth) {
        this.style.left = `${parentWidth - thisWidth}px`;
        this.classList.add('reverse');
      }
      // setting element 'top' position in relation to the parent block
      // if in the middle of parent block
      if ((elementTopPosition + shiftY + thisHeight) <= parentHeight) {
        this.style.top = `${elementTopPosition + shiftY}px`;
      }
      // if on the bottom of parent block
      else this.style.top = `${parentHeight - thisHeight}px`;
      // if on the top of parent block
      if ((elementTopPosition + shiftY) <= 0) {
        console.log(elementTopPosition + shiftY)
        this.style.top = "0px";
      }
    }
  }
}

// Show close button and added possibility to move element
function textСhange(e) {
  if (!isSelected) {
    e.stopPropagation();
  }
  // hide close button on another elements
  textNodes.forEach(node => node.children[1].hidden = true);
  textNodes.forEach(node => node.classList.remove("draggable"));
  // Show close button
  this.children[1].hidden = false;
  // add possibility to move element
  this.classList.add("draggable");
}

// hide close button if element was selected via double click
function hideCloseBtn() {
  isMoving = false;
  if (this.classList.contains("draggable")) {
    this.children[1].hidden = true;
    this.classList.remove("draggable");
  }
}

// stop drag element when the mouse button is released
function stopMoving(e) {
  textNodes.forEach(node => node.classList.remove("grabbing"));
  isMoving = false;
  // remove possibility to move elemene and hide close button when the mouse button is released outside text element
  if (!(e.target.nodeName === 'SPAN')) {
    textNodes.forEach(node => node.children[1].hidden = true);
    textNodes.forEach(node => node.classList.remove("draggable"));
  }
}

// delete text element on click
function removeElement(e) {
  this.parentNode.remove();
}

closeButtonNodes.forEach(node => node.addEventListener('click', removeElement));
textNodes.forEach(node => node.addEventListener('dblclick', hideCloseBtn));
textNodes.forEach(node => node.addEventListener('click', textСhange));
textNodes.forEach(node => node.addEventListener('mousedown', textMoving));
textNodes.forEach(node => node.addEventListener('mouseup', textСhange));
document.addEventListener('mouseup', stopMoving, { capture: true });