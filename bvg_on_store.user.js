// ==UserScript==
// @name         View Barter.vg item pages on the Steam Store
// @namespace    https://alexandra.moe/
// @version      0.1
// @description  Adds a link to Barter.vg item pages in the right sidebar of the Steam Store.
// @author       Alexandra
// @match        *://store.steampowered.com/app/*
// @grant        none
// ==/UserScript==

(function() {
    jQuery(".rightcol").prepend("<div class='block'><a class='btnv6_blue_hoverfade btn_medium' href='https://barter.vg/steam/app/" + window.location.toString().split("/")[4] + "' target='_blank'><span>⇄ View this on Barter.vg</span></a></div>");
})();
