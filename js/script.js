(function ($) {
  
  function init() {
    $.getJSON('content.json', function (data) {
      //move all this functionality into slideshow.init();
      var current_slide = data.slides[0];
      var next_slide = data.slides[1];
      var selector = '#' + current_slide.type + '-template';
      $(selector).tmpl(current_slide).appendTo('#main').addClass('current');
      var next_selector = '#' + next_slide.type + '-template';
      $(selector).tmpl(next_slide).appendTo('#main').addClass('next');
    });
  }


  $(document).ready(function () {
    $("#right-arrow").click(function (e) {
      slideshow.nextSlide();
      e.preventDefault();
    });
    $("#left-arrow").click(function (e) {
      slideshow.previousSlide();
      e.preventDefault();
    });
    var slide_numbers = [
      {slide_url: 'slide1', slide_number: 1, current: true},
      {slide_url: 'slide2', slide_number: 2},
      {slide_url: 'slide3', slide_number: 3},
      {slide_url: 'slide4', slide_number: 4}
    ];
    $("#slide-numbers-template").tmpl(slide_numbers).appendTo('#slide-numbers');
    $("#slide-numbers").show();
    init();
  });

  var slideshow = (function () {
    var currentSlide = 1;
    function nextSlide() {
      $('.slide.current').animate({
        left: -900
      }).removeClass('current').addClass('previous');
      $('.slide.next').animate({
        left: 18
      }).removeClass('next').addClass('current');
    }
    function previousSlide() {
      $('.slide.current').animate({
        left: 900
      }).removeClass('current').addClass('next');
      $('.slide.previous').animate({
        left: 18
      }).removeClass('previous').addClass('current');
    }
    function gotoSlide(num) {

    }

    function init() {

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
