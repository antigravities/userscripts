// ==UserScript==
// @name         Add sub to Barter.vg library
// @namespace    https://alexandra.moe/
// @version      0.1
// @description  Add sub to Barter.vg library
// @author       Alex
// @match        *://store.steampowered.com/sub/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Replace this with your Barter ID. Important!!!
    var myBarterID = "578";

    var items = [];

    Array.prototype.slice.call(document.getElementsByClassName("tab_item_overlay")).forEach(function(v,k){
        items.push(v.href.split("/")[4]);
    });

    items = items.join(",");

    document.getElementsByClassName("block responsive_apppage_details_right")[0].innerHTML+="<form action='https://barter.vg/u/" + myBarterID + "/l/e/#modified' method='POST'><input type='hidden' name='bulk_AppIDs' value='" + items + "'></input><input type='submit' class='btnv6_blue_hoverfade btn_medium' value='Add this sub to your Barter.vg library'></input><input type='hidden' name='action' value='Edit'></input><input type='hidden' name='change_attempted' value=1></input><input type='hidden' name='add_from' value='AppIDs'></input></form>";
})();
