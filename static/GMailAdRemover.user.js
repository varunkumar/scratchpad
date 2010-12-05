// ==UserScript==
// @name          Gmail Ad Remover
// @namespace     http://varunkumar-n.blogspot.com
// @description   Removes the sponsored links in Gmail.
// @include       http://mail.google.com/*
// @include       https://mail.google.com/*
// ==/UserScript==

window.addEventListener('load', function() {
  if (unsafeWindow.gmonkey) {
    unsafeWindow.gmonkey.load('1.0', function(gmail) {
      function setViewType() {
        if (gmail.getActiveViewType() == "cv") {
            var rhs = gmail.getConvRhsElement();
            var divList = rhs.firstChild;
            var optionsDiv = divList.firstChild;
            var linksDiv = optionsDiv.nextSibling;
            var aboutDiv = linksDiv.nextSibling;
            
            linksDiv.style.display = "none";
            aboutDiv.style.display = "none";
        }
      }
      gmail.registerViewChangeCallback(setViewType);
      setViewType();
    });
  }
}, true);
