/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var msg = "Hello!";
alert(msg);
var currentStyle = "style1";
var styles = {
  "style1": "styles/style1.css",
  "style2": "styles/style2.css",
  "style3": "styles/style3.css"
};
function changeStyle(newStyle) {
  if (styles[newStyle] && newStyle !== currentStyle) {
    var linkElement = document.querySelector("link[rel='stylesheet']");
    if (linkElement) {
      linkElement.setAttribute("href", styles[newStyle]);
      currentStyle = newStyle;
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  var links = document.querySelectorAll('a[data-style]');
  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var styleName = event.target.getAttribute('data-style');
      if (styleName) {
        changeStyle(styleName);
      }
    });
  });
});
/******/ })()
;