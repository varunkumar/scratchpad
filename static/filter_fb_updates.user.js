// ==UserScript==
// @name           Filter FB updates
// @namespace      http://varunkumar.me
// @description    Script for filtering Facebook updates about a specific topic.
// @include        http://*facebook.com*
// @include        https://*facebook.com/*
// @version        1.2
// @author         Varunkumar Nagarajan
// ==/UserScript==

//================Helper Methods==========================
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

function getAbsPos(oId, tl) {
	var o = document.getElementById(oId);
	var val = 0;
	while (o != null && o.offsetParent != null && o.offsetParent.nodeName != "body") {
		val += (tl == 'top') ? parseInt(o.offsetTop) : parseInt(o.offsetLeft);
		o = o.offsetParent;
	}
	return val;
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
//========================================================

//================Chrome Compatibility====================
if (typeof GM_deleteValue == 'undefined') {
	if(typeof unsafeWindow == 'undefined') { 
		unsafeWindow = window; 
	}
	
	GM_addStyle = function(css) {
		var style = document.createElement('style');
		style.textContent = css;
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	GM_deleteValue = function(name) {
		localStorage.removeItem(name);
	}

	GM_getValue = function(name, defaultValue) {
		var value = localStorage.getItem(name);
		if (!value)
			return defaultValue;
		var type = value[0];
		value = value.substring(1);
		switch (type) {
			case 'b':
				return value == 'true';
			case 'n':
				return Number(value);
			default:
				return value;
		}
	}

	GM_log = function(message) {
		console.log(message);
	}

	 GM_registerMenuCommand = function(name, funk) {
	//todo
	}

	GM_setValue = function(name, value) {
		value = (typeof value)[0] + value;
		localStorage.setItem(name, value);
	}
}
//========================================================

//================Global Variables========================
var screenName = "";
var timer;
//========================================================

prepareUI();

//=================UI Methods=============================	
function prepareUI() {
	if (document.getElementById("navAccount") == null) {
		// user has not signed in do nothing
		return ; 
	}
	
	screenName = document.getElementById("navAccountName").textContent;
	screenName = screenName.trim();
	
	// Adding the Filters menu
	var menu = document.getElementById("navAccount").parentNode;
	
	var list = document.createElement("li");
	list.setAttribute("id", "global-nav-filters")
	
	var anchor = document.createElement("a");
	anchor.setAttribute("id", "global-nav-filters-link");
	anchor.setAttribute("style", "color:'';position:relative");
	anchor.addEventListener("click", toggleFilterBox, false);
	anchor.innerHTML = "Filters";
	list.appendChild(anchor);
	
	menu.appendChild(list);
	
	// Preparing the filter box
	var filterBox = document.createElement('div');
	filterBox.id = 'divFilterBox';
	document.body.appendChild(filterBox);
	filterBox.setAttribute("style","-moz-border-radius-bottomleft: 5px;-webkit-border-bottom-left-radius: 5px;-moz-border-radius-bottomright: 5px;-webkit-border-bottom-right-radius: 5px;background-color:#FFFFFF;border:1px solid #BABABA;color:#3A579A;display:none;font-size:12px;margin-right:0;margin-top:6px;padding:12px;position:absolute;right:0;text-align:left;top:34px;left:100px;width:240px;z-index:1001;opacity:1");
	filterBox.innerHTML = "<b>Use this form to filter out Updates</b>";
	
	// Close Button
	var closeButton  = document.createElement("span");
	closeButton.setAttribute("style", "cursor:pointer;");
	closeButton.addEventListener("click", toggleFilterBox, false);
	closeButton.innerHTML = "<b>&nbsp;&nbsp;x&nbsp;</b>";
	filterBox.appendChild(closeButton);
	filterBox.appendChild(document.createElement("br"));
	filterBox.appendChild(document.createElement("br"));
	
	// Words Filter
	var wordsSpan = document.createElement("span");
	wordsSpan.innerHTML="Containing Words";
	filterBox.appendChild(wordsSpan);
	filterBox.appendChild(document.createElement("br"));
	var wordsFilterBox = document.createElement("input");
	wordsFilterBox.setAttribute("type", "text")
	wordsFilterBox.setAttribute("title", 'Filter out updates containing words.Use comma as a separator.');
	wordsFilterBox.addEventListener("keypress", suppressKeyStroke, true);
	wordsFilterBox.addEventListener("keydown", suppressKeyStroke, true);
	wordsFilterBox.setAttribute("id","txtWords");
	wordsFilterBox.setAttribute("value", GM_getValue(screenName + "WordsFilters", ""));
	wordsFilterBox.setAttribute("class", "inputtext");
	wordsFilterBox.setAttribute("style", "width:100%");
	filterBox.appendChild(wordsFilterBox);
	filterBox.appendChild(document.createElement("br"));
	filterBox.appendChild(document.createElement("br"));

	// Case Sensitive Checkbox
	var caseCheckBox = document.createElement("input");
	caseCheckBox.setAttribute("type", "checkbox");
	caseCheckBox.setAttribute("title", "Case Sensitive");
	caseCheckBox.setAttribute("id", "chkCase");
	if (GM_getValue(screenName + "CaseSensitive", false))
		caseCheckBox.setAttribute("checked", "true");
	filterBox.appendChild(caseCheckBox);
	var caseLabel = document.createElement("span");
	caseLabel.innerHTML = "&nbsp;Case Sensitive&nbsp;&nbsp;"
	filterBox.appendChild(caseLabel);
	filterBox.appendChild(document.createElement("br"));
	
	// Remove Likes Checkbox
	var caseLikes = document.createElement("input");
	caseLikes.setAttribute("type", "checkbox");
	caseLikes.setAttribute("title", "I don't care about what my friends like / recommend");
	caseLikes.setAttribute("id", "chkLikes");
	if (GM_getValue(screenName + "RemoveLikes", false))
		caseLikes.setAttribute("checked", "true");
	filterBox.appendChild(caseLikes);
	var likesLabel = document.createElement("span");
	likesLabel.innerHTML = "&nbsp;Hide the 'Likes' from friends&nbsp;&nbsp;"
	likesLabel.setAttribute("title", "I don't care about what my friends like / recommend");
	filterBox.appendChild(likesLabel);
	filterBox.appendChild(document.createElement("br"));
	
	// Remove Connection Checkbox
	var caseConnection = document.createElement("input");
	caseConnection.setAttribute("type", "checkbox");
	caseConnection.setAttribute("title", "I don't really care about who has be-friened whom");
	caseConnection.setAttribute("id", "chkConnection");
	if (GM_getValue(screenName + "RemoveConnection", false))
		caseConnection.setAttribute("checked", "true");
	filterBox.appendChild(caseConnection);
	var connectionLabel = document.createElement("span");
	connectionLabel.innerHTML = "&nbsp;Hide the friend connection updates&nbsp;&nbsp;"
	connectionLabel.setAttribute("title", "I don't really care about who has be-friened whom");
	filterBox.appendChild(connectionLabel);
	filterBox.appendChild(document.createElement("br"));
	
	// Remove Attachments Checkbox
	var caseAttachments = document.createElement("input");
	caseAttachments.setAttribute("type", "checkbox");
	caseAttachments.setAttribute("title", "Attachments include shared videos, photos, links, etc");
	caseAttachments.setAttribute("id", "chkAttachments");
	if (GM_getValue(screenName + "RemoveAttachments", false))
		caseAttachments.setAttribute("checked", "true");
	filterBox.appendChild(caseAttachments);
	var attachmentsLabel = document.createElement("span");
	attachmentsLabel.setAttribute("title", "Attachments include shared videos, photos, links, etc");
	attachmentsLabel.innerHTML = "&nbsp;Hide the attachments&nbsp;&nbsp;"
	filterBox.appendChild(attachmentsLabel);
	filterBox.appendChild(document.createElement("br"));
	filterBox.appendChild(document.createElement("br"));
	
	// Button Bar
	var buttonBar = document.createElement("div");
	buttonBar.setAttribute("style", "width: 100%");
	buttonBar.setAttribute("align", "center");
	filterBox.appendChild(buttonBar);
	
	// Apply Button
	var applyFilterButton = document.createElement("button");
	applyFilterButton.setAttribute("type", "button");
	applyFilterButton.setAttribute("class", "uiButton");
	applyFilterButton.setAttribute("value", "Apply");
	applyFilterButton.innerHTML = "Apply";
	applyFilterButton.setAttribute("id", "btnApply");
	applyFilterButton.addEventListener("click", applyFilters, false);
	buttonBar.appendChild(applyFilterButton);
	var spacer = document.createElement("span");
	spacer.innerHTML = "&nbsp;&nbsp;&nbsp;"
	buttonBar.appendChild(spacer);
	
	// Clear Button
	var clearFilterButton = document.createElement("button");
	clearFilterButton.setAttribute("type", "button");
	clearFilterButton.setAttribute("class", "uiButton");
	clearFilterButton.setAttribute("value", "Clear");
	clearFilterButton.innerHTML = "Clear";
	clearFilterButton.setAttribute("id", "btnClear");
	clearFilterButton.addEventListener("click", clearFilters, false);
	buttonBar.appendChild(clearFilterButton);
	
	timer = setTimeout("document.getElementById('btnApply').click();", 0);
}

function suppressKeyStroke(event) {
	event.stopPropagation();
}

var state = "closed";
function toggleFilterBox() {
	if (state == "closed") { 
		var filterMenu = document.getElementById("global-nav-filters");
		filterMenu.setAttribute("style", "background-color:#FFFFFF");
		var filterMenuLink = document.getElementById("global-nav-filters-link");
		filterMenuLink.setAttribute("style", "color:#333333;position:relative");
		
		var filterBox = document.getElementById("divFilterBox");
		filterBox.style.left = (getAbsPos("global-nav-filters", "left") + parseInt(filterMenu.offsetWidth) - parseInt(filterBox.style.width) - 25) + "px";
		filterBox.style.display = "block";
		
		state = "opened";
	} else if (state == "opened") {
		var filterMenu = document.getElementById("global-nav-filters");
		filterMenu.setAttribute("style", "background-color:''");
		
		var filterMenuLink = document.getElementById("global-nav-filters-link");
		filterMenuLink.setAttribute("style", "color:'';position:relative");
		
		var filterBox = document.getElementById("divFilterBox");
		filterBox.style.display = "none";
		state = "closed";
	}
	return ;
}

function clearFilters () {
	var txtWords = document.getElementById('txtWords');
	var chkCase = document.getElementById('chkCase');
        var chkLikes = document.getElementById('chkLikes');
	var chkConnection = document.getElementById('chkConnection');
	var chkAttachments = document.getElementById('chkAttachments');
	
	txtWords.value = "";
	chkCase.checked = false;
	chkLikes.checked = false;
	chkConnection.checked = false;
	chkAttachments.checked = false;
	
	applyFilters();
};

 function applyFilters () {	
	var txtWords = document.getElementById('txtWords');
	var chkCase = document.getElementById('chkCase');
	var chkLikes = document.getElementById('chkLikes');
	var chkConnection = document.getElementById('chkConnection');
	var chkAttachments = document.getElementById('chkAttachments');
	
	var wordsStr = txtWords.value;
	var caseSensitive = chkCase.checked;
	var removeLikes = chkLikes.checked;
	var removeConnection = chkConnection.checked;
	var removeAttachments = chkAttachments.checked;
	
	var statuses = document.evaluate(".//*[@id='home_stream']/li", document, null, XPathResult.ANY_TYPE, null); 

	// Cleaning the input
	wordsStr = wordsStr.trim();
	
	// Saving the filter values
	try {
		GM_setValue(screenName + "WordsFilters", wordsStr);
		GM_setValue(screenName + "CaseSensitive", caseSensitive);
		GM_setValue(screenName + "RemoveLikes", removeLikes);
		GM_setValue(screenName + "RemoveConnection", removeConnection);
		GM_setValue(screenName + "RemoveAttachments", removeAttachments);
	} catch(e) {}
	
	var matchedStatuses = [];
	var unmatchedStatuses = [];
	
	var status = statuses.iterateNext(); 
	
	// Check if the user is in profile page
	if (status == null) {
		statuses = document.evaluate(".//*[@id='profile_minifeed']/div", document, null, XPathResult.ANY_TYPE, null); 
		status = statuses.iterateNext(); 
	}
	while (status) {
		var content = status.textContent;
		
		// Filtering the likes and friend connection
		var passiveContents = getElementByClass("uiStreamPassive", status);
		var passiveContent = (passiveContents.length > 0) ? passiveContents[0].textContent : "";
		passiveContent = passiveContent.toLowerCase();
		
		// Getting the attachment title
		var attachments = getElementByClass("uiAttachmentTitle", status);
		
		// Cleaning up the contents
		if (content == null || content.length == 0)
			content = "";
		
		if (!caseSensitive) {
			content = content.toLowerCase();
		}
		
		var found = false;
		
		// Like filtering
		if (removeLikes && (passiveContent.indexOf(" likes ") != -1 || passiveContent.indexOf(" recommends ") != -1 || passiveContent.indexOf(" like ") != -1 || passiveContent.indexOf(" recommend ") != -1))
			found = true;
			
		// Friend Connection filtering
		if (removeConnection && (passiveContent.indexOf(" now friends with ") != -1 || passiveContent.indexOf(" now friends.") != -1))
			found = true;
		
		// Filtering attachments. Shared Links, Videos, Photos, etc.
		if (removeAttachments) {
			if (attachments.length > 0)
				found = true;
			else {
				// Check for attachments without title on the stream
				attachments = getElementByClass("uiStreamAttachments", status);
				if (attachments.length > 0)
					found = true;
				else {
					// Check for attachments title on profile page
					attachments = getElementByClass("UIStoryAttachment_Title", status);
					if (attachments.length > 0)
						found = true;
					else {
						attachments = getElementByClass("UIStoryAttachment", status);
						if (attachments.length > 0)
							found = true;
					}
				}
			}
		}
		
		// Keywords filtering
		if (!found) {
			var wordFilters = wordsStr.split(",");
			for (var i = 0; i < wordFilters.length; i++) {
				var filter = wordFilters[i].trim();
				if (filter == "")
					continue;
				
				if (!caseSensitive)
					filter = filter.toLowerCase();
				
				if (content.indexOf(filter) != -1) {
					found = true;
					break;
				} 
			}
		}
				
		if (found) {
			matchedStatuses.push(status);
		} else {
			unmatchedStatuses.push(status);
		}
			
		status = statuses.iterateNext();
	}

	// Need to do this outside the iteration as the iterator will be invalidated if there are any updates to the DOM
	// Refer to https://developer.mozilla.org/en/DOM/document.evaluate
	for (i = 0; i < matchedStatuses.length; i++) {
		matchedStatuses[i].style.display = 'none';
	}
	
	for (i = 0; i < unmatchedStatuses.length; i++) {
		unmatchedStatuses[i].style.display = 'block';
	}
	
	var linkFilters = document.getElementById("global-nav-filters-link");
	if (matchedStatuses.length > 0) {
		linkFilters.innerHTML = "Filters <span class='jewelCount' style='background-color: #F03D25;border: 0px;border-bottom-left-radius: 2px 2px;border-bottom-right-radius: 2px 2px;border-top: 0px;border-top-left-radius: 2px 2px;border-top-right-radius: 2px 2px;display: block;padding: 1px 2px 0px 1px;'><span>" + matchedStatuses.length + "</span></span>";
	} else {
		linkFilters.innerHTML = "Filters";
	}
	
	if (timer != null)
		clearTimeout(timer);
	timer = setTimeout("document.getElementById('btnApply').click();", 1000 * 15);
};
//========================================================