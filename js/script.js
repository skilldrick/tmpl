(function ($) {
  $(document).ready(function () {
    setupHandlers();
    slideshow.init();
  });
  
  function setupHandlers() {
    var prevX = 0;
    var prevY = 0;

    $("#right-arrow").click(function (e) {
      slideshow.next();
      e.preventDefault();
    });
    $("#left-arrow").click(function (e) {
      slideshow.previous();
      e.preventDefault();
    });
    $(document).keydown(function(e){
      //left arrow key
      if (e.keyCode == 37) { 
        slideshow.previous();
        return false;
      }
      //right arrow key or spacebar
      if (e.keyCode == 39 || e.keyCode == 32) { 
        slideshow.next();
        return false;
      }
      //home key
      if (e.keyCode == 36) {
        slideshow.first();
      }
      //end key
      if (e.keyCode == 35) {
        slideshow.last();
      }
    });
    $('#main').delegate('.slide', 'click', function (e) {
      var clickTolerance = 2;
      var dx = Math.abs(e.pageX - prevX);
      var dy = Math.abs(e.pageY - prevY);
      //if mouse has moved less than two pixels in any direction this is a click
      if (dx < clickTolerance && dy < clickTolerance) {
        slideshow.next();
      }
    });
    $('#main').delegate('.slide', 'mousedown', function (e) {
      prevX = e.pageX;
      prevY = e.pageY;
    });
    $('#main').delegate('a', 'click', function (e) {
      //Clicks on links shouldn't fire '.slide'.click() above
      e.stopPropagation();
    });
    $(window).hashchange(function () {
      slideshow.gotoSlide(document.location.hash);
    });

  }


  var slideshow = (function () {
    var slides = [];
    var destinationSlide;
    var navDisabled = false;
    var timeout;
    var queue = [];

    function getSlideNumberFromHash(hash) {
      url = hash.slice(1); //drop '#' from URL
      for (var i = 0, len = slides.length; i < len; i++) {
        if (slides[i].url === url) {
          return i;
        }
      }
      return 0;
    }

    function showSlideNumbers() {
      var slide_numbers = [];
      for (var i = 0, len = slides.length; i < len; i++) {
        slide_numbers.push({slide_url: slides[i].url, slide_number: i + 1, slide_title: slides[i].title});
      }
      slide_numbers[destinationSlide].current = true;
      $("#slide-numbers-template").tmpl(slide_numbers).appendTo('#slide-numbers');
      $("#slide-numbers").show();
    }
    
    function slideChanged() {
      var url = slides[currentSlide].url;
      $('#slide-numbers li').removeClass('current');
      $('#slide-numbers a[href=#' + url + ']').closest('li').addClass('current');
      setTitle();
    }

    function setTitle() {
      if (currentSlide === 0) {
        document.title = 'jQuery.tmpl() presentation';
      }
      else {
        document.title = 'jQuery.tmpl() - ' + slides[currentSlide].title;
      }
    }
    
    //Add the next direction to the animation queue, and update the 
    //destination slide number
    function gotoSlide(numOrUrl) {
      var num;
      var shouldAnimate = false;
      var instantAnimation = false;

      if (typeof numOrUrl === "string") {
        num = getSlideNumberFromHash(numOrUrl);
      }
      else {
        num = numOrUrl;
      }

      //Only start animating if the queue is empty
      //If it's not empty, it should already be animating.
      if (queue.length === 0) {
        shouldAnimate = true;
      }

      //If difference is greater than 1, don't animate
      if (Math.abs(num - destinationSlide) > 1) {
        instantAnimation = true;
      }


      while (num !== destinationSlide) {
        if (destinationSlide < num) {
          queue.push(1);
          destinationSlide++;
        }
        else {
          queue.push(-1);
          destinationSlide--;
        }
      }

      if (shouldAnimate) {
        animate(instantAnimation);
      }
    }

    //Check the next direction in the animation queue, then
    //animate slides in that direction.
    function animate(instant) {
      var duration = instant ? 1 : 300;
      var nextDirection = queue[0];
      //if queue is empty stop animation
      if (nextDirection === undefined) {
        return;
      }

      currentSlide += nextDirection;

      $('.slide.current').animate({
        left: -900 * nextDirection //slide left or right depending on direction
      }, duration, function () {
        //after current animation, drop the current queue item and animate again
        queue.shift();
        animate(instant);
      }).removeClass('current');

      $('#slide-' + slides[currentSlide].url).animate({
        left: 18
      }, duration).addClass('current');

      slideChanged();
    }

    function changeHash(slideNumber) {
      document.location.hash = '#' + slides[slideNumber].url;
    }

    //Left arrow or key was pressed
    function previous() {
      if (destinationSlide > 0) {
        //When hash changes, hashchanged is fired. This then calls gotoSlide
        changeHash(destinationSlide - 1);
      }
    }

    //Right arrow or key was pressed
    function next() {
      if (destinationSlide < slides.length - 1) {
        changeHash(destinationSlide + 1);
      }
    }

    function first() {
      changeHash(0);
    }

    function last() {
      changeHash(slides.length - 1);
    }

    //Initialise slideshow by loading content as JSON.
    //If there is a slide number in the hash, start there.
    function init() {
      $.getJSON('content.json', function (data) {
        slides = data.slides;
        var tmpl_selector;
        var slide;
        destinationSlide = getSlideNumberFromHash(document.location.hash);
        currentSlide = destinationSlide;
        setTitle();
        for (var i = 0, len = slides.length; i < len; i++) {
          tmpl_selector = '#' + slides[i].type + '-template';
          slide = $(tmpl_selector).tmpl(slides[i]).appendTo('#main');
          if (i == destinationSlide) {
            slide.addClass('current');
          }
          else if (i < destinationSlide) {
            slide.addClass('previous');
          }
          else {
            slide.addClass('next');
          }
        }
        showSlideNumbers();
        //syntax highlighting
        hljs.tabReplace = '  ';
        hljs.initHighlighting();
      });
    }

    //Expose the public API of slideshow
    return {
      next: next,
      previous: previous,
      first: first,
      last: last,
      gotoSlide: gotoSlide,
      init: init
    };
  })();

})(jQuery);
