var header = document.querySelector(".main-header");
var open = document.querySelector(".main-header__open");
var close = document.querySelector(".main-header__close");
var toggle = document.querySelector(".before-after__range-toggle");
var scale = document.querySelector(".before-after__scale");
var scaleRect = scale.getBoundingClientRect();
var catBefore = document.querySelector(
  ".before-after__image-container--before"
);
var catAfter = document.querySelector(".before-after__image-container--after");

var toggleWidth = toggle.clientWidth / 2;
var toggleLimits = {
  current: (this.right - this.left) / 2,
  left: scaleRect.left,
  right: scaleRect.right,
  width: scaleRect.width,
};

function getPolygonVertClip(leftPerc, inverse) {
  if (inverse) {
    return (
      "polygon(" +
      leftPerc +
      "% 0%, 100% 0%, 100% 100%, " +
      leftPerc +
      "% 100%)"
    );
  }
  return "polygon(0 0%, " + leftPerc + "% 0%, " + leftPerc + "% 100%, 0% 100%)";
}

function setClipPath(element, clipPath) {
  console.log(element);
  element.style.clipPath = clipPath;
}

function changeToggle(mouseX) {
  var newToggle;

  switch (true) {
    case mouseX < toggleLimits.left:
      newToggle = 0;
      break;
    case mouseX > toggleLimits.right:
      newToggle = toggleLimits.width;
      break;
    default:
      newToggle = mouseX - toggleLimits.left;
  }

  newToggle -= toggleWidth;

  toggle.style.left = newToggle + "px";

  setClipPath(
    catBefore,
    getPolygonVertClip(Math.floor((newToggle / toggleLimits.width) * 100))
  );

  setClipPath(
    catAfter,
    getPolygonVertClip(Math.floor((newToggle / toggleLimits.width) * 100), true)
  );
}

header.classList.remove("main-header--no-js");

open.addEventListener("click", function () {
  header.classList.add("main-header--active");
});

close.addEventListener("click", function () {
  header.classList.remove("main-header--active");
});

toggle.addEventListener("mousedown", function (e) {
  function onMove(e) {
    changeToggle(e.clientX);
  }

  function onMouseUp(e) {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onMouseUp);
});
