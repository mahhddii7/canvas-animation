const html = document.documentElement;
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 1800;
const array = []
var selector = ".section";

var $slides = $(selector);

var currentSlide = 0;
var isAnimating = false;

var stopAnimation = function () {
  setTimeout(function () {
    isAnimating = false;
  }, 300);
};
$(document).ready(() => {
  $('#hero-lightpass').addClass('active')
  $('#section0').addClass('active')
})
var bottomIsReached = function ($elem) {
  var rect = $elem[0].getBoundingClientRect();
  console.log(rect.bottom);
  console.log($(window).height());
  return rect.bottom <= $(window).height();
};

var topIsReached = function ($elem) {
  var rect = $elem[0].getBoundingClientRect();
  return rect.top >= 0;
};

const currentFrame = index => (
  `./img/test-${index.toString().padStart(4, '0')}.jpg`
)

const preloadImages = () => {
  for (let i = 1; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    array.push(img)
  }
};

const img = new Image()
img.src = currentFrame(2);
canvas.width = 1902;
canvas.height = window.innerHeight;
img.onload = function () {
  context.drawImage(img, 0, 0);
}

const updateImage = index => {
  context.drawImage(array[index], 0, 0);
}

window.addEventListener('scroll', () => {

  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = (scrollTop / maxScrollTop);
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );

  requestAnimationFrame(() => updateImage(frameIndex + 1))
});

document.addEventListener(
  "wheel",
  function (event) {
    var $currentSlide = $($slides[currentSlide]);

    if (isAnimating) {
      event.preventDefault();
      return;
    }

    var direction = -event.deltaY;

    if (direction < 0) {
      // next
      if (currentSlide + 1 >= $slides.length) return;
      if (!bottomIsReached($currentSlide)) return;
      event.preventDefault();
      currentSlide++;
      var $slide = $($slides[currentSlide]);
      var offsetTop = $slide.offset().top;
      isAnimating = true;
      $($slides[currentSlide - 1]).removeClass('active')
      $($slides[currentSlide]).addClass('active')
      $("html, body").animate(
        {
          scrollTop: offsetTop
        },
        1000,
        stopAnimation
      );
    } else {
      // back
      if (currentSlide - 1 < 0) return;
      if (!topIsReached($currentSlide)) return;
      event.preventDefault();
      currentSlide--;
      var $slide = $($slides[currentSlide]);
      var offsetTop = $slide.offset().top;
      isAnimating = true;
      $($slides[currentSlide + 1]).removeClass('active')
      $($slides[currentSlide]).addClass('active')
      $("html, body").animate(
        {
          scrollTop: offsetTop
        },
        1000,
        stopAnimation
      );
    }
  },
  { passive: false }
);
preloadImages()