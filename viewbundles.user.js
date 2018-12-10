// ==UserScript==
// @name         View Bundles on Offer Pages
// @namespace    https://alexandra.moe/
// @version      0.1
// @description  View the bundles an item has been on Barter.vg offer pages.
// @author       Alexandra
// @match        https://barter.vg/u/*/o/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    Array.prototype.slice.call(document.querySelectorAll(".tradables_items_list > li[data-item-id] > .tradables_info")).forEach(i => {
        var item = i.parentElement.getAttribute("data-item-id");
        var e = document.createElement("a");
        e.innerHTML = "&#x1F4E6;"
        e.addEventListener("click", function(){
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://barter.vg/i/" + item,
                onload: function(res){
                    e.innerHTML = "";
                    res = new DOMParser().parseFromString(res.responseText, "text/html");
                    Array.prototype.slice.call(res.querySelectorAll(".collection > tbody > tr:not(:first-child)")).forEach(i => {
                        var img = document.createElement("img");
                        img.src = i.querySelector("td > a > img").getAttribute("src");
                        img.title = i.querySelector("td > a").innerText.trim() + "; started " + i.querySelectorAll(".right")[1].innerText;
                        img.style = "padding-right: 2px;"
                        e.appendChild(img);
                    });
                }
            });
        });
        i.appendChild(e);
    });
})();
