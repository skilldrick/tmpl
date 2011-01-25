(function ($) {
  $(document).ready(function () {
    setupHandlers();
    slideshow.init();
  });
  
  function setupHandlers() {
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
      //right arrow key
      if (e.keyCode == 39) { 
        slideshow.next();
        return false;
      }
    });
    //to make this cross-browser this needs to change to
    //Ben Alman's hashchange plugin.
    $(window).bind('hashchange', function () {
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
        slide_numbers.push({slide_url: slides[i].url, slide_number: i + 1});
      }
      slide_numbers[destinationSlide].current = true;
      $("#slide-numbers-template").tmpl(slide_numbers).appendTo('#slide-numbers');
      $("#slide-numbers").show();
    }
    
    //update list of slides at bottom
    function slideChanged() {
      var url = slides[currentSlide].url;
      $('#slide-numbers li').removeClass('current');
      $('#slide-numbers a[href=#' + url + ']').closest('li').addClass('current');
    }
    
    //Add the next direction to the animation queue, and update the 
    //destination slide number
    function gotoSlide(numOrUrl) {
      var num;
      var shouldAnimate = false;
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
        animate();
      }
    }

    //Check the next direction in the animation queue, then
    //animate slides in that direction.
    function animate() {
      var nextDirection = queue[0];
      //if queue is empty stop animation
      if (nextDirection === undefined) {
        return;
      }

      currentSlide += nextDirection;

      $('.slide.current').animate({
        left: -900 * nextDirection //slide left or right depending on direction
      }, function () {
        //after current animation, drop the current queue item and animate again
        queue.shift();
        animate();
      }).removeClass('current');
      $('#slide-' + slides[currentSlide].url).animate({
        left: 18
      }).addClass('current');

      slideChanged();
    }

    //Left arrow or key was pressed
    function previous() {
      if (destinationSlide > 0) {
        //When hash changes, hashchanged is fired. This then calls gotoSlide
        document.location.hash = '#' + slides[destinationSlide - 1].url;
      }
    }

    //Right arrow or key was pressed
    function next() {
      if (destinationSlide < slides.length - 1) {
        //When hash changes, hashchanged is fired. This then calls gotoSlide
        document.location.hash = '#' + slides[destinationSlide + 1].url;
      }
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
      });
    }

    //Expose the public API of slideshow
    return {
      next: next,
      previous: previous,
      gotoSlide: gotoSlide,
      init: init
    };
  })();

})(jQuery);

  /*
 http://www.borismoore.com/2010/09/introducing-jquery-templates-1-first.html

http://blog.reybango.com/2010/07/09/not-using-jquery-javascript-templates-youre-really-missing-out/

  ${expression} renders expression, HTML encoded
  {{html expression}} renders expression as HTML
  
  */

//Templates can process arbitrary expressions
//"But don't go overboard! There is not a complete JavaScript parser
//in the context of inline expressions in the template. If you have
//complex code, write a function, and call the function from your
//template, and pass parameters if you need to: ${myFunction(a,b)}"
function doSomething(str) {
  return str.toUpperCase() + ' - look, I did something!';
}

//Debugging: you can do a console.log() in a template to find out
//what's going on there.

//As apps get more ajaxified, it makes sense for the server to just
//return JSON. Using templates like this means we can simplify
//the JavaScript needed to render that data, and keep the view
//code out of the JavaScript.
//
//Variables available within template:
//
//$: The jQuery object.
//
//$item: The current template item - which allows access to
//$item.data, $item.parent, etc. as well as any user-defined values
//or methods passed in with the options map.
//
//$data: The current data item (equivalent to $item.data).
//
//Note: A template tag with content such as {{each}}...{{/each}} may
//expose additional variables to template evaluation within the
//content. In the case of {{each}}, for example, the additional
//template variables $value and $index are provided within the
//content of the {{each}} tag.
//
//
//{{if}} and {{else}} are simple
//
//{{html}} is like ${} but with unencoded HTML
//
//{{wrap}} is confusing - best avoided for now.
