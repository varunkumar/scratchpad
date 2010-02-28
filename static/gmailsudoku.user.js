// ==UserScript==
// @name           GMail Su|do|ku
// @namespace      http://varunkumar-n.blogspot.com
// @description    Adds a nav box to Gmail where in you can play Su|do|ku
// @include        http://mail.google.com/*
// @include        https://mail.google.com/*
// ==/UserScript==

window.addEventListener('load', function() {
  if (unsafeWindow.gmonkey) {  
    unsafeWindow.gmonkey.load('1.0', function(gmail) {
        var game_module = gmail.addNavModule('Su|do|ku');
        game_module.setContent("<br/><div id='container' style='font-size:10pt;'></div>" +
                    "<center><a href='javascript:void(0);' onclick='document.getElementById(\"container\").appendChild(init(2,1));generate(2);this.style.display=\"none\";'>Load<br/></a><br/></center>");
                   
        var myScript=document.createElement("script");
        myScript.src='http://varun-store.appspot.com/static/sudoku.js';
        game_module.getContentElement().appendChild(myScript);
    });
  }
}, true);