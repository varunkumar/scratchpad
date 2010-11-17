// ==UserScript==
// @name           Disable Instant Previews
// @namespace      http://blog.varunkumar.me
// @description    GM Script to disable Google Instant Previews
// @include        http://www.google.*
// @include        https://www.google.*
// @exclude        http://www.google.*/accounts/*
// @exclude        https://www.google.*/accounts/*
// @exclude        http://www.google.*/adsense/*
// @exclude        https://www.google.*/adsense/*
// @exclude        http://www.google.*/analytics/*
// @exclude        https://www.google.*/analytics/*
// @exclude        http://www.google.*/alerts/*
// @exclude        https://www.google.*/alerts/*
// @exclude        http://www.google.*/base/*
// @exclude        https://www.google.*/base/*
// @exclude        http://www.google.*/bookmarks/*
// @exclude        https://www.google.*/bookmarks/*
// @exclude        http://www.google.*/books/*
// @exclude        https://www.google.*/books/*
// @exclude        http://www.google.*/buzz*
// @exclude        https://www.google.*/buzz*
// @exclude        http://www.google.*/calendar/*
// @exclude        https://www.google.*/calendar/*
// @exclude        http://www.google.*/contacts/*
// @exclude        https://www.google.*/contacts/*
// @exclude        http://www.google.*/chrome/*
// @exclude        https://www.google.*/chrome/*
// @exclude        http://www.google.*/dashboard/*
// @exclude        https://www.google.*/dashboard/*
// @exclude        http://www.google.*/dictionary/*
// @exclude        https://www.google.*/dictionary/*
// @exclude        http://www.google.*/friendconnect/*
// @exclude        https://www.google.*/friendconnect/*
// @exclude        http://www.google.*/health/*
// @exclude        https://www.google.*/health/*
// @exclude        http://www.google.*/history/*
// @exclude        https://www.google.*/history/*
// @exclude        http://www.google.*/latitude/*
// @exclude        https://www.google.*/latitude/*
// @exclude        http://www.google.*/local/*
// @exclude        https://www.google.*/local/*
// @exclude        http://www.google.*/mail/*
// @exclude        https://www.google.*/mail/*
// @exclude        http://www.google.*/maps/*
// @exclude        https://www.google.*/maps/*
// @exclude        http://www.google.*/music/*
// @exclude        https://www.google.*/music/*
// @exclude        http://www.google.*/news*
// @exclude        https://www.google.*/news*
// @exclude        http://www.google.*/notebook/*
// @exclude        https://www.google.*/notebook/*
// @exclude        http://www.google.*/phone/*
// @exclude        https://www.google.*/phone/*
// @exclude        http://www.google.*/photos/*
// @exclude        https://www.google.*/photos/*
// @exclude        http://www.google.*/picasa/*
// @exclude        https://www.google.*/picasa/*
// @exclude        http://www.google.*/places/*
// @exclude        https://www.google.*/places/*
// @exclude        http://www.google.*/profiles/*
// @exclude        https://www.google.*/profiles/*
// @exclude        http://www.google.*/reader/*
// @exclude        https://www.google.*/reader/*
// @exclude        http://www.google.*/sites/*
// @exclude        https://www.google.*/sites/*
// @exclude        http://www.google.*/squared*
// @exclude        https://www.google.*/squared*
// @exclude        http://www.google.*/subscribedlinks/*
// @exclude        https://www.google.*/subscribedlinks/*
// @exclude        http://www.google.*/talk/*
// @exclude        https://www.google.*/talk/*
// @exclude        http://www.google.*/tasks/*
// @exclude        https://www.google.*/tasks/*
// @exclude        http://www.google.*/translate/*
// @exclude        https://www.google.*/translate/*
// @exclude        http://www.google.*/transliterate/*
// @exclude        https://www.google.*/transliterare/*
// @exclude        http://www.google.*/voice/*
// @exclude        https://www.google.*/voice/*
// @exclude        http://www.google.*/video/*
// @exclude        https://www.google.*/video/*
// @exclude        http://www.google.*/webmasters/*
// @exclude        https://www.google.*/webmasters/*
// ==/UserScript==

// Adding button to enable / disable previews
var button = document.createElement("a");
button.innerHTML="Disable Instant Previews";
button.setAttribute("id", "btnPreviewSwitch");
button.setAttribute("href", "javascript:void(0);");
button.setAttribute("style", "position: absolute; top: 35px; right: 10px; z-index: 101");
button.addEventListener("click", togglePreview, false);
document.body.appendChild(button);

function togglePreview() {
	var button = document.getElementById("btnPreviewSwitch");
	if (button.innerHTML == "Disable Instant Previews") {
		// Removing the preview box
		var vspb = document.getElementById("vspb");
		if (vspb != null) {
			vspb.style.display = "none";
		}

		// Removing the preview icon
		var vspib = getElementByClass("vspib", document.body);
		for (var i = 0; vspib && i < vspib.length; i++) {
			if (vspib[i] != null) // too much defensive??
				vspib[i].style.display = "none";
		}
		
		// Disabling the JSONP callback method. 
		if (unsafeWindow != null && unsafeWindow.google != null && unsafeWindow.google.vs != null) {
			unsafeWindow.google.vs.r_original = unsafeWindow.google.vs.r;
			unsafeWindow.google.vs.r = function(a) { /* do nothing  */ };
		}
		
		button.innerHTML = "Enable Instant Previews";
	} else {
		// Showing the preview box
		var vspb = document.getElementById("vspb");
		if (vspb != null) {
			vspb.style.display = "block";
		}

		// Showing the preview icon
		var vspib = getElementByClass("vspib", document.body);
		for (var i = 0; vspib && i < vspib.length; i++) {
			if (vspib[i] != null) // too much defensive??
				vspib[i].style.display = "inline";
		}
		
		// Enabling the JSONP calls
		if (unsafeWindow != null && unsafeWindow.google != null && unsafeWindow.google.vs != null) {
			unsafeWindow.google.vs.r = unsafeWindow.google.vs.r_original;
		}
		
		button.innerHTML = "Disable Instant Previews";
	}
}
function getElementByClass(theClass, ref) {
	var allHTMLTags = ref.getElementsByTagName("*");

	var matches = [];
	for (var i = 0; i < allHTMLTags.length; i++) {
		if (allHTMLTags[i].className != null && allHTMLTags[i].className.indexOf(theClass) != -1)
			matches.push(allHTMLTags[i]);
	}
	return matches;
}