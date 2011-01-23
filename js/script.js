$(document).ready(function () {
  var data = { title: "Page 1", 
    list: [ 
      "This is a list item",
      "This is also a list item"
    ]
  };

  $('#simple-template').tmpl(data).appendTo('#main');

  /*
 http://www.borismoore.com/2010/09/introducing-jquery-templates-1-first.html

http://blog.reybango.com/2010/07/09/not-using-jquery-javascript-templates-youre-really-missing-out/

  ${expression} renders expression, HTML encoded
  {{html expression}} renders expression as HTML
  
  */
});

//Templates can process arbitrary expressions
//"But don't go overboard! There is not a complete JavaScript parser
//in the context of inline expressions in the template. If you have
//complex code, write a function, and call the function from your
//template, and pass parameters if you need to: ${myFunction(a,b)}"
function doSomething(str) {
  return str.toUpperCase() + ' - look, I did something!';
}

