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

  */
});
