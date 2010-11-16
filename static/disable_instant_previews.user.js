// ==UserScript==
// @name           Disable Instant Previews
// @namespace      http://blog.varunkumar.me
// @description    GM Script to disable Google Instant Previews
// @include        http://www.google.*
// @include        https://www.google.*
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