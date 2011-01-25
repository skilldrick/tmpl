(function ($) {
  

  $(document).ready(function () {
    $("#right-arrow").click(function (e) {
      slideshow.nextSlide();
      e.preventDefault();
    });
    $("#left-arrow").click(function (e) {
      slideshow.previousSlide();
      e.preventDefault();
    });
    slideshow.init();
  });

  var slideshow = (function () {
    var slides = [];
    var currentSlide = 0;

    function showSlideNumbers() {
      var slide_numbers = [];
      for (var i = 0, len = slides.length; i < len; i++) {
        slide_numbers.push({slide_url: slides[i].url, slide_number: i + 1});
      }
      slide_numbers[currentSlide].current = true;
      $("#slide-numbers-template").tmpl(slide_numbers).appendTo('#slide-numbers');
      $("#slide-numbers").show();
    }
    
    function nextSlide() {
      if (currentSlide >= slides.length - 1) {
        return;
      }
      $('.slide.current').animate({
        left: -900
      }).removeClass('current');
      $('#slide-' + slides[currentSlide + 1].url).animate({
        left: 18
      }).addClass('current');
      currentSlide++;
    }

    function previousSlide() {
      if (currentSlide <= 0) {
        return;
      }
      $('.slide.current').animate({
        left: 900
      }).removeClass('current');
      $('#slide-' + slides[currentSlide - 1].url).animate({
        left: 18
      }).addClass('current');
      currentSlide--;
    }
    
    function gotoSlide(num) {
      //while not currentslide, nextslide (or previous)
    }

    function init() {
      $.getJSON('content.json', function (data) {
        slides = data.slides;
        var tmpl_selector;
        var slide;
        for (var i = 0, len = slides.length; i < len; i++) {
          tmpl_selector = '#' + slides[i].type + '-template';
          slide = $(tmpl_selector).tmpl(slides[i]).appendTo('#main');
          if (i == currentSlide) {
            slide.addClass('current');
          }
          else {
            slide.addClass('next');
          }
        }
        showSlideNumbers();
      });
    }

    return {
      nextSlide: nextSlide,
      previousSlide: previousSlide,
      gotoSlide: gotoSlide,
      init: init
    }
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
