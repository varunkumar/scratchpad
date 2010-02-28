// ==UserScript==
// @name           Orkut Ad remover
// @namespace      http://varunkumar-n.blogspot.com
// @include        http://www.orkut.*
// ==/UserScript==
function removeAd() {
var top_ads = document.getElementById("top_ads");
var rhs_ads = document.getElementById("rhs_ads");
if (top_ads != null)
    top_ads.style.display = "none";
if (rhs_ads != null)
    rhs_ads.style.display = "none";
};

removeAd();
